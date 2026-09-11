export type Tenant = {
  tenantId: string;
  companyName: string;
  businessType: 'Jewellery' | 'Gem' | 'Workshop' | 'Multi-Branch';
  status: 'Active' | 'Trial' | 'Suspended';
  country: string;
  currency: string;
};

export type Product = {
  _id?: string;
  productId: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  unitPrice: number;
  weightGrams: number;
  status: 'In stock' | 'Low stock' | 'Out of stock';
  tenantId: string;
};

export type InvoiceItem = {
  itemId: string;
  name: string;
  qty: number;
  unitPrice: number;
  total: number;
};

export type Invoice = {
  invoiceId: string;
  tenantId: string;
  customerName: string;
  totalAmount: number;
  status: 'Draft' | 'Paid' | 'Partial' | 'Overdue';
  items: InvoiceItem[];
};

export type UserRole = 'admin' | 'owner' | 'manager' | 'cashier' | 'user';

export type AppUser = {
  userId: string;
  username: string;
  role: UserRole;
  tenantId: string;
  displayName: string;
  active: boolean;
};

export type Customer = {
  customerId: string;
  tenantId: string;
  name: string;
  phone: string;
  outstanding: number;
  status: 'Active' | 'Pending' | 'Complete';
};

export type WorkshopJob = {
  jobId: string;
  tenantId: string;
  customerName: string;
  stage: 'Issued to Workshop' | 'Quality Check' | 'Completed';
  dueDate: string;
  status: 'In Progress' | 'Pending' | 'Completed';
};

export type DashboardSummary = {
  sales: number;
  purchases: number;
  profit: number;
  outstanding: number;
  lowStockCount: number;
  workshopOpen: number;
};
