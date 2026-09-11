import { NextResponse } from 'next/server';

import { InvoiceModel } from '@/lib/mongo-models';
import { connectToDatabase } from '@/lib/mongodb';
import { getRepository } from '@/lib/repository';

export async function GET() {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const invoices = await InvoiceModel.find({}).lean();
      return NextResponse.json({ success: true, data: invoices });
    } catch {
      // fall through to repository fallback
    }
  }

  return NextResponse.json({
    success: true,
    data: getRepository().invoices,
  });
}

export async function POST(request: Request) {
  const payload = await request.json();

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const items = Array.isArray(payload.items) ? payload.items : [];
      const subtotal = items.reduce((sum: number, item: any) => sum + Number(item.total ?? item.unitPrice ?? 0), 0);

      const newInvoice = await InvoiceModel.create({
        invoiceId: payload.invoiceId ?? `INV-${Date.now()}`,
        tenantId: payload.tenantId ?? 'TEN-001',
        customerName: payload.customerName ?? 'Walk-in Customer',
        subtotal,
        discount: Number(payload.discount ?? 0),
        totalAmount: Number(payload.totalAmount ?? subtotal),
        status: payload.status ?? 'Draft',
        items: items.map((item: any) => ({
          itemId: item.itemId ?? `IT-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          name: item.name ?? 'Item',
          qty: Number(item.qty ?? 1),
          unitPrice: Number(item.unitPrice ?? 0),
          total: Number(item.total ?? Number(item.unitPrice ?? 0) * Number(item.qty ?? 1)),
        })),
      });

      return NextResponse.json({ success: true, data: newInvoice }, { status: 201 });
    } catch {
      // fall through to repository fallback
    }
  }

  const repository = getRepository();
  const now = new Date().toISOString();
  const items = Array.isArray(payload.items) ? payload.items : [];
  const subtotal = items.reduce((sum: number, item: any) => sum + Number(item.total ?? item.unitPrice ?? 0), 0);

  const newInvoice = {
    _id: payload.invoiceId ?? `INV-${Date.now()}`,
    invoiceId: payload.invoiceId ?? `INV-${Date.now()}`,
    tenantId: payload.tenantId ?? 'TEN-001',
    customerName: payload.customerName ?? 'Walk-in Customer',
    subtotal,
    discount: Number(payload.discount ?? 0),
    totalAmount: Number(payload.totalAmount ?? subtotal),
    status: payload.status ?? 'Draft',
    items: items.map((item: any) => ({
      itemId: item.itemId ?? `IT-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: item.name ?? 'Item',
      qty: Number(item.qty ?? 1),
      unitPrice: Number(item.unitPrice ?? 0),
      total: Number(item.total ?? Number(item.unitPrice ?? 0) * Number(item.qty ?? 1)),
    })),
    createdAt: now,
    updatedAt: now,
  };

  repository.invoices.unshift(newInvoice);

  return NextResponse.json({ success: true, data: newInvoice }, { status: 201 });
}

export async function PUT(request: Request) {
  const payload = await request.json();

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const nextItems = Array.isArray(payload.items) ? payload.items : [];
      const subtotal = nextItems.reduce((sum: number, item: any) => sum + Number(item.total ?? item.unitPrice ?? 0), 0);

      const updatedInvoice = await InvoiceModel.findOneAndUpdate(
        { invoiceId: payload.invoiceId },
        {
          ...payload,
          subtotal,
          discount: Number(payload.discount ?? 0),
          totalAmount: Number(payload.totalAmount ?? subtotal),
          items: nextItems.map((item: any) => ({
            itemId: item.itemId ?? `IT-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            name: item.name ?? 'Item',
            qty: Number(item.qty ?? 1),
            unitPrice: Number(item.unitPrice ?? 0),
            total: Number(item.total ?? Number(item.unitPrice ?? 0) * Number(item.qty ?? 1)),
          })),
        },
        { new: true }
      ).lean();

      if (!updatedInvoice) {
        return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: updatedInvoice });
    } catch {
      // fall through to repository fallback
    }
  }

  const repository = getRepository();
  const index = repository.invoices.findIndex((invoice) => invoice.invoiceId === payload.invoiceId);

  if (index === -1) {
    return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
  }

  const nextItems = Array.isArray(payload.items) ? payload.items : repository.invoices[index].items;
  const subtotal = nextItems.reduce((sum: number, item: any) => sum + Number(item.total ?? item.unitPrice ?? 0), 0);
  const updatedInvoice = {
    ...repository.invoices[index],
    ...payload,
    subtotal,
    discount: Number(payload.discount ?? repository.invoices[index].discount ?? 0),
    totalAmount: Number(payload.totalAmount ?? subtotal),
    items: nextItems.map((item: any) => ({
      itemId: item.itemId ?? `IT-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: item.name ?? 'Item',
      qty: Number(item.qty ?? 1),
      unitPrice: Number(item.unitPrice ?? 0),
      total: Number(item.total ?? Number(item.unitPrice ?? 0) * Number(item.qty ?? 1)),
    })),
    updatedAt: new Date().toISOString(),
  };

  repository.invoices[index] = updatedInvoice;

  return NextResponse.json({ success: true, data: updatedInvoice });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const invoiceId = searchParams.get('id');

  if (!invoiceId) {
    return NextResponse.json({ success: false, error: 'Invoice id required' }, { status: 400 });
  }

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const deleted = await InvoiceModel.findOneAndDelete({ invoiceId }).lean();

      if (!deleted) {
        return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: { invoiceId } });
    } catch {
      // fall through to repository fallback
    }
  }

  const repository = getRepository();
  const originalLength = repository.invoices.length;
  repository.invoices = repository.invoices.filter((invoice) => invoice.invoiceId !== invoiceId);

  if (repository.invoices.length === originalLength) {
    return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: { invoiceId } });
}
