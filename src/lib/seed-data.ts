import type { Invoice, Product, Tenant } from './types';

export const defaultTenants: Tenant[] = [
  {
    tenantId: 'TEN-001',
    companyName: 'WCS Gold House',
    businessType: 'Jewellery',
    status: 'Active',
    country: 'Sri Lanka',
    currency: 'LKR',
  },
  {
    tenantId: 'TEN-002',
    companyName: 'Gem Craft Studio',
    businessType: 'Gem',
    status: 'Trial',
    country: 'Sri Lanka',
    currency: 'LKR',
  },
];

export const defaultProducts: Product[] = [
  {
    productId: 'PRD-1001',
    sku: 'GR-001',
    name: 'Gold Ring',
    category: 'Ring',
    stock: 12,
    unitPrice: 125000,
    weightGrams: 3.25,
    status: 'In stock',
    tenantId: 'TEN-001',
  },
  {
    productId: 'PRD-1002',
    sku: 'DN-278',
    name: 'Diamond Necklace',
    category: 'Necklace',
    stock: 4,
    unitPrice: 320000,
    weightGrams: 14.8,
    status: 'Low stock',
    tenantId: 'TEN-001',
  },
  {
    productId: 'PRD-1003',
    sku: 'PS-044',
    name: 'Pearl Set',
    category: 'Set',
    stock: 3,
    unitPrice: 190000,
    weightGrams: 8.5,
    status: 'Low stock',
    tenantId: 'TEN-001',
  },
];

export const defaultInvoices: Invoice[] = [
  {
    invoiceId: 'INV-1048',
    tenantId: 'TEN-001',
    customerName: 'Nimal Perera',
    totalAmount: 535000,
    status: 'Paid',
    items: [
      {
        itemId: 'IT-1',
        name: 'Gold Ring GR-001',
        qty: 1,
        unitPrice: 125000,
        total: 125000,
      },
      {
        itemId: 'IT-2',
        name: 'Pearl Necklace PN-041',
        qty: 1,
        unitPrice: 185000,
        total: 185000,
      },
      {
        itemId: 'IT-3',
        name: 'Diamond Pendant DP-014',
        qty: 1,
        unitPrice: 240000,
        total: 240000,
      },
    ],
  },
];
