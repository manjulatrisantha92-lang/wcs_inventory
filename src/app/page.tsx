'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navigation = [
  { label: 'Dashboard', icon: '🏠', active: true },
  { label: 'Invoice', icon: '🧾' },
  { label: 'Inventory', icon: '💎' },
  { label: 'Purchasing', icon: '🛒' },
  { label: 'Customers', icon: '👤' },
  { label: 'Jewellery Orders', icon: '💍' },
  { label: 'Workshop', icon: '🔧' },
  { label: 'Certificates', icon: '📜' },
  { label: 'Reports', icon: '📊' },
  { label: 'Promotions', icon: '📢' },
  { label: 'Users', icon: '👥' },
  { label: 'Settings', icon: '⚙️' },
  { label: 'Backup', icon: '💾' },
];

const metrics = [
  { label: 'Sales', value: 'Rs. 1,245,800', tone: 'emerald' },
  { label: 'Purchases', value: 'Rs. 886,300', tone: 'amber' },
  { label: 'Profit', value: 'Rs. 359,500', tone: 'sky' },
  { label: 'Outstanding', value: 'Rs. 148,250', tone: 'rose' },
];

const invoiceRows = [
  { item: 'Gold Ring GR-001', qty: 1, weight: '3.25 g', rate: 'Rs. 125,000', total: 'Rs. 125,000' },
  { item: 'Pearl Necklace PN-041', qty: 1, weight: '14.80 g', rate: 'Rs. 185,000', total: 'Rs. 185,000' },
  { item: 'Diamond Pendant DP-014', qty: 1, weight: '2.60 g', rate: 'Rs. 240,000', total: 'Rs. 240,000' },
];

const inventoryRows = [
  { product: 'Gold Ring', code: 'GR-001', category: 'Ring', stock: 12, price: 'Rs. 125,000', status: 'In stock' },
  { product: 'Diamond Necklace', code: 'DN-278', category: 'Necklace', stock: 4, price: 'Rs. 320,000', status: 'Low stock' },
  { product: 'Pearl Set', code: 'PS-044', category: 'Set', stock: 3, price: 'Rs. 190,000', status: 'Low stock' },
  { product: 'Gemstone Bracelet', code: 'GB-110', category: 'Bracelet', stock: 9, price: 'Rs. 98,500', status: 'In stock' },
];

const workshopOrders = [
  { id: 'WO-201', customer: 'Nimal Perera', stage: 'Issued to Workshop', due: 'Today', status: 'In Progress' },
  { id: 'WO-202', customer: 'Anushka Silva', stage: 'Quality Check', due: 'Tomorrow', status: 'Pending' },
  { id: 'WO-203', customer: 'Dimuthu Jayasuriya', stage: 'Completed', due: 'Delivered', status: 'Completed' },
];

const customerBalance = [
  { name: 'Nimal Perera', balance: 'Rs. 18,400', status: 'Active' },
  { name: 'Anushka Silva', balance: 'Rs. 31,250', status: 'Pending' },
  { name: 'Dimuthu Jayasuriya', balance: 'Rs. 8,900', status: 'Complete' },
];

const quickActions = ['New Invoice', 'Stock Import', 'Workshop Order', 'Customer Report', 'WhatsApp Promo'];

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState<{ username: string; role: string; displayName: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' });
        const data = await response.json();

        if (!response.ok || !data.authenticated) {
          router.push('/login');
          return;
        }

        setSession(data.user);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [router]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  const roleLabel = session?.role ? session.role.charAt(0).toUpperCase() + session.role.slice(1) : 'User';

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800">
      <div className="flex min-h-screen">
        <aside className="w-full max-w-[260px] bg-[#0f172a] px-4 py-6 text-slate-200">
          <div className="mb-8 px-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4af37] text-lg font-bold text-slate-900">
                W
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">WCS</div>
                <div className="text-lg font-bold text-white">Inventory Invoice</div>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`sidebar-link w-full ${item.active ? 'bg-[#1e293b] text-white' : 'text-slate-300'}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Business dashboard</p>
              <h1 className="text-2xl font-bold text-slate-900">Today&apos;s business</h1>
            </div>

            <div className="flex items-center gap-4">
              <button type="button" className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                🔔 Alerts
              </button>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d4af37] font-bold text-slate-900">
                  {session?.displayName?.charAt(0)?.toUpperCase() ?? 'A'}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{loading ? 'Loading...' : session?.displayName ?? 'Admin'}</div>
                  <div className="text-xs text-slate-500">{loading ? 'Preparing session' : `${roleLabel} • ${session?.username ?? 'admin'}`}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          </header>

          <div className="space-y-6 p-6">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="metric-box">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                    <span className={`status-pill ${metric.tone === 'emerald' ? 'bg-emerald-100 text-emerald-700' : metric.tone === 'amber' ? 'bg-amber-100 text-amber-700' : metric.tone === 'rose' ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'}`}>
                      {metric.tone === 'emerald' ? '↑ 12%' : metric.tone === 'amber' ? '↑ 8%' : metric.tone === 'rose' ? '↑ 4%' : '↑ 15%'}
                    </span>
                  </div>
                  <div className="mt-4 text-3xl font-bold text-slate-900">{metric.value}</div>
                </div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="card">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Quick invoice</h2>
                  <button type="button" className="rounded-lg bg-[#0f172a] px-3 py-2 text-sm font-medium text-white">New invoice</button>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                        <span>Find product</span>
                        <span>Barcode</span>
                      </div>
                      <input
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#d4af37]"
                        defaultValue="Search by code / design / name"
                      />
                    </div>

                    <div className="space-y-2">
                      {invoiceRows.map((row) => (
                        <div key={row.item} className="grid grid-cols-[1.5fr_0.45fr_0.55fr_0.55fr_0.55fr] gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                          <div>
                            <div className="font-medium text-slate-800">{row.item}</div>
                            <div className="text-xs text-slate-500">{row.weight}</div>
                          </div>
                          <div className="text-slate-600">{row.qty}</div>
                          <div className="text-slate-600">{row.rate}</div>
                          <div className="text-slate-600">{row.total}</div>
                          <button type="button" className="text-right font-medium text-[#d4af37]">Edit</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm text-slate-500">Invoice #</span>
                      <span className="font-bold text-slate-900">INV-1048</span>
                    </div>
                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex justify-between"><span>Customer</span><span className="font-medium text-slate-800">Nimal Perera</span></div>
                      <div className="flex justify-between"><span>Subtotal</span><span>Rs. 550,000</span></div>
                      <div className="flex justify-between"><span>Discount</span><span>Rs. 15,000</span></div>
                      <div className="flex justify-between"><span>Tax</span><span>Rs. 0</span></div>
                      <div className="mt-3 border-t border-slate-200 pt-3 flex justify-between text-lg font-bold text-slate-900"><span>Total</span><span>Rs. 535,000</span></div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button type="button" className="flex-1 rounded-lg border border-[#d4af37] bg-[#d4af37] px-3 py-2 font-semibold text-slate-900">Save</button>
                      <button type="button" className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-700">Print</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="card">
                  <h2 className="mb-4 text-xl font-bold text-slate-900">Quick actions</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => (
                      <button key={action} type="button" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 transition hover:border-[#d4af37] hover:bg-[#f8f5f1]">
                        {action}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h2 className="mb-4 text-xl font-bold text-slate-900">Low stock</h2>
                  <div className="space-y-3">
                    {['Gold Ring GR-001', 'Pearl Set PS-044', 'Diamond Necklace DN-278'].map((item, index) => (
                      <div key={item} className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50 p-3">
                        <div>
                          <div className="font-medium text-slate-800">{item}</div>
                          <div className="text-xs text-red-600">Critical {index === 0 ? 'stock' : index === 1 ? 'alert' : 'level'}</div>
                        </div>
                        <div className="font-bold text-red-600">{index === 0 ? 8 : index === 1 ? 3 : 2}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="card">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Inventory overview</h2>
                  <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">Import Excel</button>
                </div>
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-4 py-3 font-medium">Product</th>
                        <th className="px-4 py-3 font-medium">Code</th>
                        <th className="px-4 py-3 font-medium">Stock</th>
                        <th className="px-4 py-3 font-medium">Price</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {inventoryRows.map((row) => (
                        <tr key={row.code}>
                          <td className="px-4 py-3 font-medium text-slate-800">{row.product}</td>
                          <td className="px-4 py-3 text-slate-600">{row.code}</td>
                          <td className="px-4 py-3 text-slate-600">{row.stock}</td>
                          <td className="px-4 py-3 text-slate-600">{row.price}</td>
                          <td className="px-4 py-3">
                            <span className={`status-pill ${row.status === 'In stock' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card">
                <h2 className="mb-4 text-xl font-bold text-slate-900">Workshop status</h2>
                <div className="space-y-3">
                  {workshopOrders.map((order) => (
                    <div key={order.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-slate-800">{order.id}</div>
                        <span className={`status-pill ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-slate-600">{order.customer}</div>
                      <div className="mt-2 text-xs text-slate-500">{order.stage} • {order.due}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="card">
                <h2 className="mb-4 text-xl font-bold text-slate-900">Customer balances</h2>
                <div className="space-y-3">
                  {customerBalance.map((customer) => (
                    <div key={customer.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                      <div>
                        <div className="font-medium text-slate-800">{customer.name}</div>
                        <div className="text-xs text-slate-500">{customer.status}</div>
                      </div>
                      <div className="font-bold text-slate-900">{customer.balance}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2 className="mb-4 text-xl font-bold text-slate-900">Sales summary</h2>
                <div className="space-y-4">
                  {[
                    ['Daily Sales', 'Rs. 86,500'],
                    ['Monthly Sales', 'Rs. 1,245,800'],
                    ['Returns', 'Rs. 18,750'],
                    ['Commission', 'Rs. 16,900'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                      <span className="text-sm font-medium text-slate-600">{label}</span>
                      <span className="text-lg font-bold text-slate-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
