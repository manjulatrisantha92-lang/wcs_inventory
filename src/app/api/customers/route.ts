import { NextResponse } from 'next/server';

import { CustomerModel } from '@/lib/mongo-models';
import { connectToDatabase } from '@/lib/mongodb';
import { getRepository } from '@/lib/repository';

export async function GET() {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const customers = await CustomerModel.find({}).lean();
      return NextResponse.json({ success: true, data: customers });
    } catch {
      // fall through to repository fallback
    }
  }

  return NextResponse.json({
    success: true,
    data: getRepository().customers,
  });
}

export async function POST(request: Request) {
  const payload = await request.json();

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const newCustomer = await CustomerModel.create({
        customerId: payload.customerId ?? `CUS-${Date.now()}`,
        tenantId: payload.tenantId ?? 'TEN-001',
        name: payload.name ?? 'New Customer',
        phone: payload.phone ?? '+94770000000',
        outstanding: Number(payload.outstanding ?? 0),
        status: payload.status ?? 'Active',
      });

      return NextResponse.json({ success: true, data: newCustomer }, { status: 201 });
    } catch {
      // fall through to repository fallback
    }
  }

  const repository = getRepository();
  const now = new Date().toISOString();
  const newCustomer = {
    _id: payload.customerId ?? `CUS-${Date.now()}`,
    customerId: payload.customerId ?? `CUS-${Date.now()}`,
    tenantId: payload.tenantId ?? 'TEN-001',
    name: payload.name ?? 'New Customer',
    phone: payload.phone ?? '+94770000000',
    outstanding: Number(payload.outstanding ?? 0),
    status: payload.status ?? 'Active',
    createdAt: now,
    updatedAt: now,
  };

  repository.customers.unshift(newCustomer);

  return NextResponse.json({ success: true, data: newCustomer }, { status: 201 });
}

export async function PUT(request: Request) {
  const payload = await request.json();

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const updatedCustomer = await CustomerModel.findOneAndUpdate(
        { customerId: payload.customerId },
        {
          ...payload,
          outstanding: Number(payload.outstanding ?? 0),
        },
        { new: true }
      ).lean();

      if (!updatedCustomer) {
        return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: updatedCustomer });
    } catch {
      // fall through to repository fallback
    }
  }

  const repository = getRepository();
  const index = repository.customers.findIndex((customer) => customer.customerId === payload.customerId);

  if (index === -1) {
    return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
  }

  const updatedCustomer = {
    ...repository.customers[index],
    ...payload,
    outstanding: Number(payload.outstanding ?? repository.customers[index].outstanding),
    updatedAt: new Date().toISOString(),
  };

  repository.customers[index] = updatedCustomer;

  return NextResponse.json({ success: true, data: updatedCustomer });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get('id');

  if (!customerId) {
    return NextResponse.json({ success: false, error: 'Customer id required' }, { status: 400 });
  }

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const deleted = await CustomerModel.findOneAndDelete({ customerId }).lean();

      if (!deleted) {
        return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: { customerId } });
    } catch {
      // fall through to repository fallback
    }
  }

  const repository = getRepository();
  const originalLength = repository.customers.length;
  repository.customers = repository.customers.filter((customer) => customer.customerId !== customerId);

  if (repository.customers.length === originalLength) {
    return NextResponse.json({ success: false, error: 'Customer not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: { customerId } });
}
