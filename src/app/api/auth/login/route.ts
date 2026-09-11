import { NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/auth';

const validUsers = {
  admin: 'admin123',
  owner: 'owner123',
  user: 'user123',
};

const displayNames: Record<string, string> = {
  admin: 'System Admin',
  owner: 'Business Owner',
  user: 'Account User',
};

export async function POST(request: Request) {
  const payload = await request.json();
  const username = String(payload?.username ?? '');
  const password = String(payload?.password ?? '');

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Username and password are required.' },
      { status: 400 }
    );
  }

  const expectedPassword = validUsers[username as keyof typeof validUsers];

  if (!expectedPassword || password !== expectedPassword) {
    return NextResponse.json(
      { error: 'Invalid username or password.' },
      { status: 401 }
    );
  }

  const role = username === 'admin' ? 'admin' : username === 'owner' ? 'owner' : 'user';
  const response = NextResponse.json({
    success: true,
    user: {
      username,
      role,
      displayName: displayNames[username] || username,
    },
  });

  return await setSessionCookie(response, {
    username,
    role,
    displayName: displayNames[username] || username,
  });
}
