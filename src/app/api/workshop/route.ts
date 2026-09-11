import { NextResponse } from 'next/server';

import { WorkshopModel } from '@/lib/mongo-models';
import { connectToDatabase } from '@/lib/mongodb';
import { getRepository } from '@/lib/repository';

export async function GET() {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const jobs = await WorkshopModel.find({}).lean();
      return NextResponse.json({ success: true, data: jobs });
    } catch {
      // fall through to repository fallback
    }
  }

  return NextResponse.json({
    success: true,
    data: getRepository().workshop,
  });
}

export async function POST(request: Request) {
  const payload = await request.json();

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const newJob = await WorkshopModel.create({
        jobId: payload.jobId ?? `WO-${Date.now()}`,
        tenantId: payload.tenantId ?? 'TEN-001',
        customerName: payload.customerName ?? 'New Customer',
        description: payload.description ?? 'Workshop task',
        stage: payload.stage ?? 'Issued to Workshop',
        dueDate: payload.dueDate ?? new Date().toISOString(),
        status: payload.status ?? 'In Progress',
      });

      return NextResponse.json({ success: true, data: newJob }, { status: 201 });
    } catch {
      // fall through to repository fallback
    }
  }

  const repository = getRepository();
  const now = new Date().toISOString();
  const newJob = {
    _id: payload.jobId ?? `WO-${Date.now()}`,
    jobId: payload.jobId ?? `WO-${Date.now()}`,
    tenantId: payload.tenantId ?? 'TEN-001',
    customerName: payload.customerName ?? 'New Customer',
    description: payload.description ?? 'Workshop task',
    stage: payload.stage ?? 'Issued to Workshop',
    dueDate: payload.dueDate ?? now,
    status: payload.status ?? 'In Progress',
    createdAt: now,
    updatedAt: now,
  };

  repository.workshop.unshift(newJob);

  return NextResponse.json({ success: true, data: newJob }, { status: 201 });
}

export async function PUT(request: Request) {
  const payload = await request.json();

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const updatedJob = await WorkshopModel.findOneAndUpdate(
        { jobId: payload.jobId },
        { ...payload, dueDate: payload.dueDate ?? new Date().toISOString() },
        { new: true }
      ).lean();

      if (!updatedJob) {
        return NextResponse.json({ success: false, error: 'Workshop job not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: updatedJob });
    } catch {
      // fall through to repository fallback
    }
  }

  const repository = getRepository();
  const index = repository.workshop.findIndex((job) => job.jobId === payload.jobId);

  if (index === -1) {
    return NextResponse.json({ success: false, error: 'Workshop job not found' }, { status: 404 });
  }

  const updatedJob = {
    ...repository.workshop[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  repository.workshop[index] = updatedJob;

  return NextResponse.json({ success: true, data: updatedJob });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('id');

  if (!jobId) {
    return NextResponse.json({ success: false, error: 'Workshop job id required' }, { status: 400 });
  }

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const deleted = await WorkshopModel.findOneAndDelete({ jobId }).lean();

      if (!deleted) {
        return NextResponse.json({ success: false, error: 'Workshop job not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: { jobId } });
    } catch {
      // fall through to repository fallback
    }
  }

  const repository = getRepository();
  const originalLength = repository.workshop.length;
  repository.workshop = repository.workshop.filter((job) => job.jobId !== jobId);

  if (repository.workshop.length === originalLength) {
    return NextResponse.json({ success: false, error: 'Workshop job not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: { jobId } });
}
