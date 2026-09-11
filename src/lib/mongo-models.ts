import mongoose, { Schema } from 'mongoose';

const tenantSchema = new Schema(
  {
    tenantId: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    businessType: { type: String, enum: ['Jewellery', 'Gem', 'Workshop', 'Multi-Branch'], required: true },
    status: { type: String, enum: ['Active', 'Trial', 'Suspended'], required: true },
    country: { type: String, required: true },
    currency: { type: String, required: true },
  },
  { timestamps: true }
);

const userSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    tenantId: { type: String, required: true },
    username: { type: String, required: true },
    passwordHash: { type: String },
    role: { type: String, enum: ['admin', 'owner', 'manager', 'cashier', 'user'], required: true },
    displayName: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const customerSchema = new Schema(
  {
    customerId: { type: String, required: true, unique: true },
    tenantId: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    outstanding: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Pending', 'Complete'], default: 'Active' },
  },
  { timestamps: true }
);

const productSchema = new Schema(
  {
    productId: { type: String, required: true, unique: true },
    tenantId: { type: String, required: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    unitPrice: { type: Number, default: 0 },
    weightGrams: { type: Number, default: 0 },
    status: { type: String, enum: ['In stock', 'Low stock', 'Out of stock'], default: 'In stock' },
  },
  { timestamps: true }
);

const invoiceItemSchema = new Schema(
  {
    itemId: { type: String, required: true },
    productId: { type: String },
    name: { type: String, required: true },
    qty: { type: Number, default: 1 },
    unitPrice: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  { _id: false }
);

const invoiceSchema = new Schema(
  {
    invoiceId: { type: String, required: true, unique: true },
    tenantId: { type: String, required: true },
    customerId: { type: String },
    customerName: { type: String, required: true },
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['Draft', 'Paid', 'Partial', 'Overdue'], default: 'Draft' },
    items: [invoiceItemSchema],
  },
  { timestamps: true }
);

const workshopSchema = new Schema(
  {
    jobId: { type: String, required: true, unique: true },
    tenantId: { type: String, required: true },
    customerName: { type: String, required: true },
    description: { type: String, required: true },
    stage: { type: String, enum: ['Issued to Workshop', 'Quality Check', 'Completed'], default: 'Issued to Workshop' },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['In Progress', 'Pending', 'Completed'], default: 'In Progress' },
  },
  { timestamps: true }
);

export const TenantModel = mongoose.models.Tenant || mongoose.model('Tenant', tenantSchema, 'tenants');
export const UserModel = mongoose.models.User || mongoose.model('User', userSchema, 'users');
export const CustomerModel = mongoose.models.Customer || mongoose.model('Customer', customerSchema, 'customers');
export const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema, 'products');
export const InvoiceModel = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema, 'invoices');
export const WorkshopModel = mongoose.models.Workshop || mongoose.model('Workshop', workshopSchema, 'workshop');
