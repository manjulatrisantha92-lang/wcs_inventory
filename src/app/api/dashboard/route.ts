import { NextResponse } from 'next/server';

import { getRepository } from '@/lib/repository';

export async function GET() {
  const repository = getRepository();

  const sales = repository.invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  const purchases = repository.products.reduce((sum, product) => sum + product.unitPrice * product.stock, 0);
  const outstanding = repository.customers.reduce((sum, customer) => sum + customer.outstanding, 0);
  const lowStockCount = repository.products.filter((product) => product.stock <= 4).length;
  const workshopOpen = repository.workshop.filter((job) => job.status !== 'Completed').length;
  const profit = Math.max(sales - purchases, 0);

  return NextResponse.json({
    success: true,
    data: {
      sales,
      purchases,
      profit,
      outstanding,
      lowStockCount,
      workshopOpen,
    },
  });
}
