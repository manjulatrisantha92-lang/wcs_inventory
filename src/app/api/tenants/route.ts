import { NextResponse } from 'next/server';

import { defaultTenants } from '@/lib/seed-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: defaultTenants,
  });
}

export async function POST(request: Request) {
  const payload = await request.json();

  const newTenant = {
    tenantId: payload.tenantId ?? `TEN-${Date.now()}`,
    companyName: payload.companyName ?? 'New Tenant',
    businessType: payload.businessType ?? 'Jewellery',
    status: payload.status ?? 'Active',
    country: payload.country ?? 'Sri Lanka',
    currency: payload.currency ?? 'LKR',
  };

  return NextResponse.json(
    {
      success: true,
      data: newTenant,
    },
    { status: 201 }
  );
}
