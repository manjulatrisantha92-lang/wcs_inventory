import { NextResponse } from 'next/server';

export type SessionRole = 'admin' | 'owner' | 'user';

export type SessionUser = {
  username: string;
  role: SessionRole;
  displayName: string;
};

export type SessionData = SessionUser & {
  expiresAt: number;
};

export const SESSION_COOKIE_NAME = 'wcs_session';
export const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

function arrayBufferToBase64Url(value: ArrayBuffer): string {
  const bytes = new Uint8Array(value);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function getSigningSecret(): string {
  return process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'wcs-dev-secret-change-me';
}

async function signHmacSha256(secret: string, payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return arrayBufferToBase64Url(signature);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let difference = 0;
  for (let index = 0; index < a.length; index += 1) {
    difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return difference === 0;
}

export async function signSession(session: SessionData): Promise<string> {
  const payload = toBase64Url(JSON.stringify(session));
  const signature = await signHmacSha256(getSigningSecret(), payload);
  return `${payload}.${signature}`;
}

export async function verifySession(value: string | null | undefined): Promise<SessionData | null> {
  if (!value) {
    return null;
  }

  const parts = value.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return null;
  }

  const [payloadPart, signaturePart] = parts;
  const expectedSignature = await signHmacSha256(getSigningSecret(), payloadPart);

  if (!constantTimeEqual(signaturePart, expectedSignature)) {
    return null;
  }

  try {
    const parsed = JSON.parse(fromBase64Url(payloadPart)) as Partial<SessionData>;
    if (!parsed.username || !parsed.role || !parsed.expiresAt || Date.now() > parsed.expiresAt) {
      return null;
    }

    return {
      username: parsed.username,
      role: parsed.role as SessionRole,
      displayName: parsed.displayName || parsed.username,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(response: NextResponse, user: SessionUser): Promise<NextResponse> {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const session: SessionData = {
    ...user,
    expiresAt,
  };

  const sessionValue = await signSession(session);

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: sessionValue,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });

  return response;
}

export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}
