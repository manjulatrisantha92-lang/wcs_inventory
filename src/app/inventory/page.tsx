'use client';

import { type FormEvent, useEffect, useMemo, useState } from 'react';

type ProductRecord = {
  productId: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  unitPrice: number;
  weightGrams: number;
  status: string;
  tenantId: string;
};

const emptyProductForm = {
  productId: '',
  sku: '',
  name: '',
  category: 'Rings',
  stock: 0,
  unitPrice: 0,
  weightGrams: 0,
  status: 'In stock',
  tenantId: 'TEN-001',
};

const importSteps = ['Upload Excel', 'Preview data', 'Validate rows', 'Import to MongoDB'];

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProductForm);

  async function loadProducts() {
    try {
      const response = await fetch('/api/products');
      const result = await response.json();
      setProducts(result?.data ?? []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const totals = useMemo(() => {
    const totalProducts = products.length;
    const stockValue = products.reduce((sum, product) => sum + product.stock * product.unitPrice, 0);
    const lowStock = products.filter((product) => product.stock <= 4).length;
    const outOfStock = products.filter((product) => product.stock === 0).length;

    return {
      totalProducts,
      stockValue,
      lowStock,
      outOfStock,
    };
  }, [products]);

  const handleChange = (field: keyof typeof emptyProductForm, value: string | number) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      productId: form.productId || `PRD-${Date.now()}`,
      sku: form.sku || `SKU-${Date.now()}`,
      stock: Number(form.stock),
      unitPrice: Number(form.unitPrice),
      weightGrams: Number(form.weightGrams),
    };

    try {
      const response = await fetch(`/api/products${editingProductId ? '' : ''}`, {
        method: editingProductId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          productId: editingProductId ?? payload.productId,
        }),
      });

      const result = await response.json();
      if (response.ok && result?.data) {
        setProducts((current) => {
          if (editingProductId) {
            return current.map((product) => (product.productId === editingProductId ? result.data : product));
          }
          return [result.data, ...current];
        });
        setForm(emptyProductForm);
        setEditingProductId(null);
        setIsFormOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const openEditProduct = (product: ProductRecord) => {
    setEditingProductId(product.productId);
    setForm({
      productId: product.productId,
      sku: product.sku,
      name: product.name,
      category: product.category,
      stock: product.stock,
      unitPrice: product.unitPrice,
      weightGrams: product.weightGrams,
      status: product.status,
      tenantId: product.tenantId,
    });
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Delete this product?')) {
      return;
    }

    const response = await fetch(`/api/products?id=${encodeURIComponent(productId)}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setProducts((current) => current.filter((product) => product.productId !== productId));
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-800">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Inventory</p>
            <h1 className="text-3xl font-bold text-slate-900">Jewellery stock management</h1>
          </div>
          <button type="button" onClick={() => {
            setIsFormOpen((current) => !current);
            if (!isFormOpen) {
              setEditingProductId(null);
              setForm(emptyProductForm);
            }
          }} className="rounded-xl bg-[#0f172a] px-4 py-2.5 font-semibold text-white">
            {isFormOpen ? 'Close form' : '+ Add product'}
          </button>
        </div>

        {isFormOpen && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Add inventory item</h2>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <label className="text-sm font-medium text-slate-700">
                Product name
                <input value={form.name} onChange={(event) => handleChange('name', event.target.value)} required className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                SKU
                <input value={form.sku} onChange={(event) => handleChange('sku', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Product ID
                <input value={form.productId} onChange={(event) => handleChange('productId', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Category
                <select value={form.category} onChange={(event) => handleChange('category', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]">
                  <option>Rings</option>
                  <option>Necklaces</option>
                  <option>Earrings</option>
                  <option>Bracelets</option>
                  <option>Gem Stones</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                Stock
                <input type="number" min={0} value={form.stock} onChange={(event) => handleChange('stock', Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Unit price
                <input type="number" min={0} value={form.unitPrice} onChange={(event) => handleChange('unitPrice', Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Weight (g)
                <input type="number" min={0} value={form.weightGrams} onChange={(event) => handleChange('weightGrams', Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Status
                <select value={form.status} onChange={(event) => handleChange('status', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]">
                  <option>In stock</option>
                  <option>Low stock</option>
                  <option>Out of stock</option>
                  <option>On hold</option>
                </select>
              </label>

              <div className="md:col-span-2 xl:col-span-3 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => {
                  setIsFormOpen(false);
                  setEditingProductId(null);
                  setForm(emptyProductForm);
                }} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-[#0f172a] px-4 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
                  {saving ? 'Saving...' : editingProductId ? 'Update product' : 'Save product'}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="mb-6 grid gap-4 md:grid-cols-4">
          {[
            ['Total products', String(totals.totalProducts || 0)],
            ['Stock value', `Rs. ${totals.stockValue.toLocaleString('en-LK')}`],
            ['Low stock', String(totals.lowStock)],
            ['Out of stock', String(totals.outOfStock)],
          ].map(([label, value]) => (
            <div key={label} className="metric-box">
              <div className="text-sm text-slate-500">{label}</div>
              <div className="mt-3 text-3xl font-bold text-slate-900">{value}</div>
            </div>
          ))}
        </section>

        <section className="mb-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Products</h2>
              <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">Export Excel</button>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Code</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        Loading inventory...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        No products available.
                      </td>
                    </tr>
                  ) : (
                    products.map((item) => (
                      <tr key={item.productId}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.weightGrams} g</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{item.sku}</td>
                        <td className="px-4 py-3 text-slate-600">{item.category}</td>
                        <td className="px-4 py-3 text-slate-600">{item.stock}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-800">Rs. {item.unitPrice.toLocaleString('en-LK')}</div>
                          <div className="text-xs text-slate-500">{item.status}</div>
                          <div className="mt-2 flex gap-2">
                            <button type="button" onClick={() => openEditProduct(item)} className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700">Edit</button>
                            <button type="button" onClick={() => handleDeleteProduct(item.productId)} className="rounded border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-600">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Import / Export</h2>
            <div className="space-y-3">
              {importSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d4af37] text-sm font-bold text-slate-900">{index + 1}</div>
                  <span className="text-sm font-medium text-slate-700">{step}</span>
                </div>
              ))}
            </div>

            <button type="button" className="mt-6 w-full rounded-xl bg-[#0f172a] px-4 py-3 font-semibold text-white">
              Import Excel
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
