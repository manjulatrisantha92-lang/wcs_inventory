import { NextResponse } from 'next/server';

import { getRepository } from '@/lib/repository';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: getRepository().users,
  });
}
