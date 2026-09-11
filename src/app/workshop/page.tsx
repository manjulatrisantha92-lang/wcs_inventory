'use client';

import { type FormEvent, useEffect, useState } from 'react';

type WorkshopOrder = {
  jobId: string;
  customerName: string;
  stage: string;
  status: string;
  description?: string;
};

const emptyOrderForm = {
  jobId: '',
  customerName: '',
  description: '',
  stage: 'Issued to Workshop',
  status: 'In Progress',
  dueDate: new Date().toISOString().slice(0, 10),
  tenantId: 'TEN-001',
};

export default function WorkshopPage() {
  const [orders, setOrders] = useState<WorkshopOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyOrderForm);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch('/api/workshop');
        const result = await response.json();
        setOrders(result?.data ?? []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const handleChange = (field: keyof typeof emptyOrderForm, value: string) => {
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
      jobId: form.jobId || `WO-${Date.now()}`,
    };

    try {
      const response = await fetch('/api/workshop', {
        method: editingJobId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          jobId: editingJobId ?? payload.jobId,
        }),
      });

      const result = await response.json();
      if (response.ok && result?.data) {
        setOrders((current) => {
          if (editingJobId) {
            return current.map((order) => (order.jobId === editingJobId ? result.data : order));
          }
          return [result.data, ...current];
        });
        setForm(emptyOrderForm);
        setEditingJobId(null);
        setIsFormOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const openEditOrder = (order: WorkshopOrder) => {
    setEditingJobId(order.jobId);
    setForm({
      jobId: order.jobId,
      customerName: order.customerName,
      description: order.description ?? '',
      stage: order.stage,
      status: order.status,
      dueDate: new Date().toISOString().slice(0, 10),
      tenantId: 'TEN-001',
    });
    setIsFormOpen(true);
  };

  const handleDeleteOrder = async (jobId: string) => {
    if (!confirm('Delete this workshop order?')) {
      return;
    }

    const response = await fetch(`/api/workshop?id=${encodeURIComponent(jobId)}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setOrders((current) => current.filter((order) => order.jobId !== jobId));
    }
  };

  const workshops = [
    { name: 'Lanka Gold Studio', type: 'Goldsmith', contact: '+94 77 223 1111', status: 'Active' },
    { name: 'Diamond Craft Hub', type: 'Diamond Setting', contact: '+94 71 445 7788', status: 'Active' },
    { name: 'Pearl Finish Works', type: 'Finishing', contact: '+94 76 998 3221', status: 'Inactive' },
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-800">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Workshop</p>
            <h1 className="text-3xl font-bold text-slate-900">Workshop operations</h1>
          </div>
          <button type="button" onClick={() => {
            setIsFormOpen((current) => !current);
            if (!isFormOpen) {
              setEditingJobId(null);
              setForm(emptyOrderForm);
            }
          }} className="rounded-xl bg-[#0f172a] px-4 py-2.5 font-semibold text-white">
            {isFormOpen ? 'Close form' : '+ Add workshop'}
          </button>
        </div>

        {isFormOpen && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Add workshop order</h2>
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Job ID
                <input value={form.jobId} onChange={(event) => handleChange('jobId', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Customer
                <input value={form.customerName} onChange={(event) => handleChange('customerName', event.target.value)} required className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]" />
              </label>
              <label className="text-sm font-medium text-slate-700 md:col-span-2">
                Description
                <textarea value={form.description} onChange={(event) => handleChange('description', event.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Stage
                <select value={form.stage} onChange={(event) => handleChange('stage', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]">
                  <option>Issued to Workshop</option>
                  <option>Quality Check</option>
                  <option>Completed</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700">
                Status
                <select value={form.status} onChange={(event) => handleChange('status', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]">
                  <option>In Progress</option>
                  <option>Pending</option>
                  <option>Completed</option>
                </select>
              </label>
              <label className="text-sm font-medium text-slate-700 md:col-span-2">
                Due date
                <input type="date" value={form.dueDate} onChange={(event) => handleChange('dueDate', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-800 outline-none focus:border-[#d4af37]" />
              </label>

              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => {
                  setIsFormOpen(false);
                  setEditingJobId(null);
                  setForm(emptyOrderForm);
                }} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-medium text-slate-700">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-[#0f172a] px-4 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
                  {saving ? 'Saving...' : editingJobId ? 'Update order' : 'Save order'}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="mb-6 grid gap-4 md:grid-cols-3">
          {workshops.map((shop) => (
            <div key={shop.name} className="card">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-lg font-bold text-slate-900">{shop.name}</div>
                <span className={`status-pill ${shop.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                  {shop.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-slate-600">
                <div><span className="font-medium text-slate-700">Type:</span> {shop.type}</div>
                <div><span className="font-medium text-slate-700">Contact:</span> {shop.contact}</div>
              </div>
            </div>
          ))}
        </section>

        <section className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Workshop orders</h2>
            <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">Filter</button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Stage</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">Loading workshop orders...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">No workshop orders available.</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.jobId}>
                      <td className="px-4 py-3 font-medium text-slate-800">{order.jobId}</td>
                      <td className="px-4 py-3 text-slate-600">{order.customerName}</td>
                      <td className="px-4 py-3 text-slate-600">{order.stage}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`status-pill ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>
                            {order.status}
                          </span>
                          <button type="button" onClick={() => openEditOrder(order)} className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700">Edit</button>
                          <button type="button" onClick={() => handleDeleteOrder(order.jobId)} className="rounded border border-red-200 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-600">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
