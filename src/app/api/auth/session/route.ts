import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, verifySession } from '@/lib/auth';

export async function GET() {
  const cookieStore = cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
  const session = await verifySession(sessionValue);

  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      username: session.username,
      role: session.role,
      displayName: session.displayName,
    },
  });
}
