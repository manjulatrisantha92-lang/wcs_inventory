export type TenantRecord = {
  _id?: string;
  tenantId: string;
  companyName: string;
  businessType: 'Jewellery' | 'Gem' | 'Workshop' | 'Multi-Branch';
  status: 'Active' | 'Trial' | 'Suspended';
  country: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
};

export type UserRecord = {
  _id?: string;
  userId: string;
  tenantId: string;
  username: string;
  passwordHash?: string;
  role: 'admin' | 'owner' | 'manager' | 'cashier' | 'user';
  displayName: string;
  email?: string;
  phone?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CustomerRecord = {
  _id?: string;
  customerId: string;
  tenantId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  outstanding: number;
  status: 'Active' | 'Pending' | 'Complete';
  createdAt: string;
  updatedAt: string;
};

export type ProductRecord = {
  _id?: string;
  productId: string;
  tenantId: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  unitPrice: number;
  weightGrams: number;
  status: 'In stock' | 'Low stock' | 'Out of stock';
  createdAt: string;
  updatedAt: string;
};

export type InvoiceRecord = {
  _id?: string;
  invoiceId: string;
  tenantId: string;
  customerId?: string;
  customerName: string;
  subtotal: number;
  discount: number;
  totalAmount: number;
  status: 'Draft' | 'Paid' | 'Partial' | 'Overdue';
  items: Array<{
    itemId: string;
    productId?: string;
    name: string;
    qty: number;
    unitPrice: number;
    total: number;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type WorkshopRecord = {
  _id?: string;
  jobId: string;
  tenantId: string;
  customerName: string;
  description: string;
  stage: 'Issued to Workshop' | 'Quality Check' | 'Completed';
  dueDate: string;
  status: 'In Progress' | 'Pending' | 'Completed';
  createdAt: string;
  updatedAt: string;
};

export type BackupRecord = {
  _id?: string;
  backupId: string;
  tenantId: string;
  fileName: string;
  fileSize: number;
  type: 'full' | 'incremental';
  createdAt: string;
  status: 'Completed' | 'In Progress' | 'Failed';
};

export const schemaVersion = 'v1';
