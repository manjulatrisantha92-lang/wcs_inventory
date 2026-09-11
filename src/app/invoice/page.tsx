'use client';

import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from 'react';

type InvoiceItem = {
  name: string;
  qty: number;
  unitPrice: number;
  total: number;
};

type InvoiceRecord = {
  invoiceId: string;
  customerName: string;
  totalAmount: number;
  status: string;
  items: InvoiceItem[];
};

const emptyItem: InvoiceItem = {
  name: '',
  qty: 1,
  unitPrice: 0,
  total: 0,
};

export default function InvoicePage() {
  const [invoice, setInvoice] = useState<InvoiceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    customerName: 'Nimal Perera',
    invoiceId: 'INV-1048',
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: 'Cash',
    discount: 15000,
    items: [
      { name: 'Diamond Ring', qty: 1, unitPrice: 250000, total: 250000 },
      { name: 'Gold Chain', qty: 2, unitPrice: 120000, total: 240000 },
    ] as InvoiceItem[],
  });

  useEffect(() => {
    async function loadInvoice() {
      try {
        const response = await fetch('/api/invoices');
        const result = await response.json();
        const firstInvoice = result?.data?.[0] ?? null;
        setInvoice(firstInvoice);
      } catch {
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    }

    loadInvoice();
  }, []);

  const lineItems = useMemo(
    () =>
      form.items.map((item) => ({
        ...item,
        total: Number(item.qty || 0) * Number(item.unitPrice || 0),
      })),
    [form.items]
  );

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const discount = Number(form.discount || 0);
  const total = Math.max(subtotal - discount, 0);
  const paid = 300000;
  const balance = Math.max(total - paid, 0);

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

        const updatedItem = {
          ...item,
          [field]: value,
        };

        if (field === 'qty' || field === 'unitPrice') {
          updatedItem.total = Number(updatedItem.qty || 0) * Number(updatedItem.unitPrice || 0);
        }

        return updatedItem;
      }),
    }));
  };

  const addItem = () => {
    setForm((current) => ({
      ...current,
      items: [...current.items, { ...emptyItem }],
    }));
  };

  const removeItem = (index: number) => {
    setForm((current) => ({
      ...current,
      items: current.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    const payload = {
      invoiceId: form.invoiceId || `INV-${Date.now()}`,
      customerName: form.customerName || 'Walk-in Customer',
      status: 'Draft',
      discount,
      totalAmount: total,
      items: lineItems.map((item) => ({
        ...item,
        total: Number(item.total || 0),
      })),
    };

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok && result?.data) {
        setInvoice(result.data);
        setMessage('Invoice saved successfully.');
      } else {
        setMessage('Unable to save invoice.');
      }
    } catch {
      setMessage('Unable to save invoice.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-800">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Invoice</p>
            <h1 className="text-3xl font-bold text-slate-900">Create sales invoice</h1>
          </div>
          <div className="flex gap-3">
            <button type="button" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700">Save draft</button>
            <button type="button" className="rounded-xl bg-[#0f172a] px-4 py-2.5 font-semibold text-white">Print invoice</button>
          </div>
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="card">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Customer</label>
                <input value={form.customerName} onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-700 outline-none focus:border-[#d4af37]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Invoice number</label>
                <input value={form.invoiceId} onChange={(event) => setForm((current) => ({ ...current, invoiceId: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-700 outline-none focus:border-[#d4af37]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Date</label>
                <input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-700 outline-none focus:border-[#d4af37]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Payment method</label>
                <select value={form.paymentMethod} onChange={(event) => setForm((current) => ({ ...current, paymentMethod: event.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-700 outline-none focus:border-[#d4af37]">
                  <option>Cash</option>
                  <option>Card</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Item</th>
                    <th className="px-4 py-3 font-medium">Qty</th>
                    <th className="px-4 py-3 font-medium">Rate</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">Loading invoice...</td>
                    </tr>
                  ) : form.items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No items added yet.</td>
                    </tr>
                  ) : (
                    form.items.map((item, index) => (
                      <tr key={`${item.name}-${index}`}>
                        <td className="px-4 py-3">
                          <input value={item.name} onChange={(event: ChangeEvent<HTMLInputElement>) => updateItem(index, 'name', event.target.value)} className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-slate-700 outline-none focus:border-[#d4af37]" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="number" min={1} value={item.qty} onChange={(event: ChangeEvent<HTMLInputElement>) => updateItem(index, 'qty', Number(event.target.value))} className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-slate-700 outline-none focus:border-[#d4af37]" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="number" min={0} value={item.unitPrice} onChange={(event: ChangeEvent<HTMLInputElement>) => updateItem(index, 'unitPrice', Number(event.target.value))} className="w-28 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-slate-700 outline-none focus:border-[#d4af37]" />
                        </td>
                        <td className="px-4 py-3 text-slate-600">Rs. {((Number(item.qty || 0) * Number(item.unitPrice || 0))).toLocaleString('en-LK')}</td>
                        <td className="px-4 py-3">
                          <button type="button" onClick={() => removeItem(index)} className="rounded-lg border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-600">Remove</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between">
              <button type="button" onClick={addItem} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700">+ Add item</button>
              <button type="submit" disabled={saving} className="rounded-xl bg-[#0f172a] px-4 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
                {saving ? 'Saving...' : 'Save invoice'}
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Invoice summary</h2>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString('en-LK')}</span></div>
              <div className="flex justify-between">
                <span>Discount</span>
                <input type="number" min={0} value={form.discount} onChange={(event) => setForm((current) => ({ ...current, discount: Number(event.target.value) }))} className="w-28 rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-right text-slate-700 outline-none focus:border-[#d4af37]" />
              </div>
              <div className="flex justify-between"><span>Making charge</span><span>Rs. 12,500</span></div>
              <div className="flex justify-between"><span>Tax</span><span>Rs. 0</span></div>
              <div className="mt-3 border-t border-slate-200 pt-3 flex justify-between text-lg font-bold text-slate-900"><span>Total</span><span>Rs. {total.toLocaleString('en-LK')}</span></div>
            </div>

            <div className="mt-6 space-y-3">
              <label className="block text-sm font-medium text-slate-700">Amount paid</label>
              <input value={`Rs. ${paid.toLocaleString('en-LK')}`} readOnly className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-700 outline-none focus:border-[#d4af37]" />
              <label className="block text-sm font-medium text-slate-700">Balance</label>
              <input value={`Rs. ${balance.toLocaleString('en-LK')}`} readOnly className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-700 outline-none focus:border-[#d4af37]" />
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
