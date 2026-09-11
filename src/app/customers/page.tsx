'use client';

import { type FormEvent, useEffect, useState } from 'react';

type CustomerRecord = {
  customerId: string;
  name: string;
  phone: string;
  outstanding: number;
  status: string;
};

const emptyCustomerForm = {
  customerId: '',
  name: '',
  phone: '+94',
  outstanding: 0,
  status: 'Active',
  tenantId: 'TEN-001',
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyCustomerForm);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await fetch('/api/customers');
        const result = await response.json();
        setCustomers(result?.data ?? []);
      } catch {
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  const handleChange = (field: keyof typeof emptyCustomerForm, value: string | number) => {
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
      customerId: form.customerId || `CUS-${Date.now()}`,
      outstanding: Number(form.outstanding),
    };

    try {
      const response = await fetch('/api/customers', {
        method: editingCustomerId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          customerId: editingCustomerId ?? payload.customerId,
        }),
      });

      const result = await response.json();
      if (response.ok && result?.data) {
        setCustomers((current) => {
          if (editingCustomerId) {
            return current.map((customer) => (customer.customerId === editingCustomerId ? result.data : customer));
          }
          return [result.data, ...current];
        });
        setForm(emptyCustomerForm);
        setEditingCustomerId(null);
        setIsFormOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const openEditCustomer = (customer: CustomerRecord) => {
    setEditingCustomerId(customer.customerId);
    setForm({
      customerId: customer.customerId,
      name: customer.name,
      phone: customer.phone,
      outstanding: customer.outstanding,
      status: customer.status,
      tenantId: 'TEN-001',
    });
    setIsFormOpen(true);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Delete this customer?')) {
      return;
    }

    const response = await fetch(`/api/customers?id=${encodeURIComponent(customerId)}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setCustomers((current) => current.filter((customer) => customer.customerId !== customerId));
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-800">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Customers</p>
            <h1 className="text-3xl font-bold text-slate-900">Customer profiles</h1>
          </div>
          <button type="button" onClick={() => {
            setIsFormOpen((current) => !current);
            if (!isFormOpen) {
              setEditingCustomerId(null);
              setForm(emptyCustomerForm);
            }
          }} className="rounded-xl bg-[#0f172a] px-4 py-2.5 font-semibold text-white">
            {isFormOpen ? 'Close form' : '+ Add customer'}
          </button>
        </div>

        {isFormOpen && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Add customer</h2>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Customer name
                <input value={form.name} onChange={(event) => handleChange('name', event.target.value)} required className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Customer ID
                <input value={form.customerId} onChange={(event) => handleChange('customerId', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]" />
              </label>
              <label className="text-sm font-medium text-slate-700 md:col-span-2">
                Phone
                <input value={form.phone} onChange={(event) => handleChange('phone', event.target.value)} required className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Outstanding balance
                <input type="number" min={0} value={form.outstanding} onChange={(event) => handleChange('outstanding', Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Status
                <select value={form.status} onChange={(event) => handleChange('status', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]">
                  <option>Active</option>
                  <option>Pending</option>
                  <option>VIP</option>
                </select>
              </label>

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => {
                  setIsFormOpen(false);
                  setEditingCustomerId(null);
                  setForm(emptyCustomerForm);
                }} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-[#0f172a] px-4 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
                  {saving ? 'Saving...' : editingCustomerId ? 'Update customer' : 'Save customer'}
                </button>
              </div>
            </form>
          </section>
        )}

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Loading customers...
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {customers.length === 0 ? (
              <div className="col-span-full rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                No customers available.
              </div>
            ) : (
              customers.map((customer) => (
                <div key={customer.customerId} className="card">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d4af37] text-lg font-bold text-slate-900">
                      {customer.name.charAt(0)}
                    </div>
                    <span className={`status-pill ${customer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : customer.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>
                      {customer.status}
                    </span>
                  </div>

                  <div className="font-bold text-slate-900">{customer.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{customer.phone}</div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div className="rounded-xl bg-slate-50 p-2">
                      <div className="text-slate-500">Orders</div>
                      <div className="mt-1 font-bold text-slate-900">{customer.outstanding > 0 ? 1 : 0}</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2">
                      <div className="text-slate-500">Balance</div>
                      <div className="mt-1 font-bold text-slate-900">Rs. {customer.outstanding.toLocaleString('en-LK')}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button type="button" onClick={() => openEditCustomer(customer)} className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700">Edit</button>
                    <button type="button" onClick={() => handleDeleteCustomer(customer.customerId)} className="rounded border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-600">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
