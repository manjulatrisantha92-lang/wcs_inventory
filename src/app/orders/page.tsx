const orderRows = [
  { id: 'J-101', customer: 'Nimal Perera', design: 'Gold Ring', date: '2026-09-10', amount: 'Rs. 125,000', status: 'Pending' },
  { id: 'J-102', customer: 'Anushka Silva', design: 'Pearl Necklace', date: '2026-09-09', amount: 'Rs. 185,000', status: 'Workshop' },
  { id: 'J-103', customer: 'Dimuthu Jayasuriya', design: 'Diamond Pendant', date: '2026-09-08', amount: 'Rs. 240,000', status: 'Completed' },
];

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-800">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Jewellery orders</p>
            <h1 className="text-3xl font-bold text-slate-900">Customer design orders</h1>
          </div>
          <button type="button" className="rounded-xl bg-[#0f172a] px-4 py-2.5 font-semibold text-white">+ New order</button>
        </div>

        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Order management</h2>
            <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">Export</button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Design</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {orderRows.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 font-medium text-slate-800">{order.id}</td>
                    <td className="px-4 py-3 text-slate-600">{order.customer}</td>
                    <td className="px-4 py-3 text-slate-600">{order.design}</td>
                    <td className="px-4 py-3 text-slate-600">{order.date}</td>
                    <td className="px-4 py-3 text-slate-600">{order.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`status-pill ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : order.status === 'Workshop' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
