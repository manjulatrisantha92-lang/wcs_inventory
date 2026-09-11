import { defaultInvoices, defaultProducts, defaultTenants } from './seed-data';
import type {
  CustomerRecord,
  InvoiceRecord,
  ProductRecord,
  TenantRecord,
  UserRecord,
  WorkshopRecord,
} from './mongo-schemas';

export type RepositoryState = {
  tenants: TenantRecord[];
  users: UserRecord[];
  customers: CustomerRecord[];
  products: ProductRecord[];
  invoices: InvoiceRecord[];
  workshop: WorkshopRecord[];
};

const now = () => new Date().toISOString();

export const repositoryState: RepositoryState = {
  tenants: defaultTenants.map((tenant) => ({
    _id: tenant.tenantId,
    tenantId: tenant.tenantId,
    companyName: tenant.companyName,
    businessType: tenant.businessType,
    status: tenant.status,
    country: tenant.country,
    currency: tenant.currency,
    createdAt: now(),
    updatedAt: now(),
  })),
  users: [
    {
      userId: 'USR-001',
      tenantId: 'TEN-001',
      username: 'admin',
      role: 'admin',
      displayName: 'System Admin',
      email: 'admin@wcs.lk',
      active: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      userId: 'USR-002',
      tenantId: 'TEN-001',
      username: 'owner',
      role: 'owner',
      displayName: 'Business Owner',
      email: 'owner@wcs.lk',
      active: true,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      userId: 'USR-003',
      tenantId: 'TEN-001',
      username: 'user',
      role: 'user',
      displayName: 'Account User',
      email: 'user@wcs.lk',
      active: true,
      createdAt: now(),
      updatedAt: now(),
    },
  ],
  customers: [
    {
      customerId: 'CUS-001',
      tenantId: 'TEN-001',
      name: 'Nimal Perera',
      phone: '+94771234567',
      outstanding: 18400,
      status: 'Active',
      createdAt: now(),
      updatedAt: now(),
    },
    {
      customerId: 'CUS-002',
      tenantId: 'TEN-001',
      name: 'Anushka Silva',
      phone: '+94772345678',
      outstanding: 31250,
      status: 'Pending',
      createdAt: now(),
      updatedAt: now(),
    },
  ],
  products: defaultProducts.map((product) => ({
    _id: product.productId,
    productId: product.productId,
    tenantId: product.tenantId,
    sku: product.sku,
    name: product.name,
    category: product.category,
    stock: product.stock,
    unitPrice: product.unitPrice,
    weightGrams: product.weightGrams,
    status: product.status,
    createdAt: now(),
    updatedAt: now(),
  })),
  invoices: defaultInvoices.map((invoice) => ({
    _id: invoice.invoiceId,
    invoiceId: invoice.invoiceId,
    tenantId: invoice.tenantId,
    customerName: invoice.customerName,
    subtotal: invoice.items.reduce((sum, item) => sum + item.total, 0),
    discount: 15000,
    totalAmount: invoice.totalAmount,
    status: invoice.status,
    items: invoice.items.map((item) => ({
      itemId: item.itemId,
      name: item.name,
      qty: item.qty,
      unitPrice: item.unitPrice,
      total: item.total,
    })),
    createdAt: now(),
    updatedAt: now(),
  })),
  workshop: [
    {
      jobId: 'WO-201',
      tenantId: 'TEN-001',
      customerName: 'Nimal Perera',
      description: 'Gold ring polishing and resizing',
      stage: 'Issued to Workshop',
      dueDate: '2026-09-10',
      status: 'In Progress',
      createdAt: now(),
      updatedAt: now(),
    },
    {
      jobId: 'WO-202',
      tenantId: 'TEN-001',
      customerName: 'Anushka Silva',
      description: 'Necklace certification review',
      stage: 'Quality Check',
      dueDate: '2026-09-11',
      status: 'Pending',
      createdAt: now(),
      updatedAt: now(),
    },
  ],
};

export function getRepository() {
  return repositoryState;
}
