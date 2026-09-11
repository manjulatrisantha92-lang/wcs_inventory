import { NextResponse } from 'next/server';

import { ProductModel } from '@/lib/mongo-models';
import { connectToDatabase } from '@/lib/mongodb';
import { getRepository } from '@/lib/repository';

export async function GET() {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const products = await ProductModel.find({}).lean();
      return NextResponse.json({ success: true, data: products });
    } catch {
      // fall through to repository fallback
    }
  }

  return NextResponse.json({
    success: true,
    data: getRepository().products,
  });
}

export async function POST(request: Request) {
  const payload = await request.json();

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const newProduct = await ProductModel.create({
        productId: payload.productId ?? `PRD-${Date.now()}`,
        sku: payload.sku ?? 'NEW-ITEM',
        name: payload.name ?? 'New Product',
        category: payload.category ?? 'General',
        stock: Number(payload.stock ?? 0),
        unitPrice: Number(payload.unitPrice ?? 0),
        weightGrams: Number(payload.weightGrams ?? 0),
        status: payload.status ?? 'In stock',
        tenantId: payload.tenantId ?? 'TEN-001',
      });

      return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
    } catch {
      // fall through to repository fallback
    }
  }

  const repository = getRepository();
  const now = new Date().toISOString();
  const newProduct = {
    _id: payload.productId ?? `PRD-${Date.now()}`,
    productId: payload.productId ?? `PRD-${Date.now()}`,
    sku: payload.sku ?? 'NEW-ITEM',
    name: payload.name ?? 'New Product',
    category: payload.category ?? 'General',
    stock: Number(payload.stock ?? 0),
    unitPrice: Number(payload.unitPrice ?? 0),
    weightGrams: Number(payload.weightGrams ?? 0),
    status: payload.status ?? 'In stock',
    tenantId: payload.tenantId ?? 'TEN-001',
    createdAt: now,
    updatedAt: now,
  };

  repository.products.unshift(newProduct);

  return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
}

export async function PUT(request: Request) {
  const payload = await request.json();

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const updatedProduct = await ProductModel.findOneAndUpdate(
        { productId: payload.productId },
        {
          ...payload,
          stock: Number(payload.stock ?? 0),
          unitPrice: Number(payload.unitPrice ?? 0),
          weightGrams: Number(payload.weightGrams ?? 0),
        },
        { new: true }
      ).lean();

      if (!updatedProduct) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: updatedProduct });
    } catch {
      // fall through to repository fallback
    }
  }

  const repository = getRepository();
  const index = repository.products.findIndex((product) => product.productId === payload.productId);

  if (index === -1) {
    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
  }

  const updatedProduct = {
    ...repository.products[index],
    ...payload,
    stock: Number(payload.stock ?? repository.products[index].stock),
    unitPrice: Number(payload.unitPrice ?? repository.products[index].unitPrice),
    weightGrams: Number(payload.weightGrams ?? repository.products[index].weightGrams),
    updatedAt: new Date().toISOString(),
  };

  repository.products[index] = updatedProduct;

  return NextResponse.json({ success: true, data: updatedProduct });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('id');

  if (!productId) {
    return NextResponse.json({ success: false, error: 'Product id required' }, { status: 400 });
  }

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const deleted = await ProductModel.findOneAndDelete({ productId }).lean();

      if (!deleted) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: { productId } });
    } catch {
      // fall through to repository fallback
    }
  }

  const repository = getRepository();
  const originalLength = repository.products.length;
  repository.products = repository.products.filter((product) => product.productId !== productId);

  if (repository.products.length === originalLength) {
    return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: { productId } });
}
