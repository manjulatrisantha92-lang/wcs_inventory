const reportCards = [
  { title: 'Sales', value: 'Rs. 1,245,800', accent: 'emerald' },
  { title: 'Inventory', value: '452 items', accent: 'amber' },
  { title: 'Workshop', value: '12 pending', accent: 'sky' },
  { title: 'Financial', value: 'Rs. 359,500 profit', accent: 'rose' },
];

export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-800">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Reports</p>
          <h1 className="text-3xl font-bold text-slate-900">A4 report center</h1>
        </div>

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reportCards.map((report) => (
            <div key={report.title} className="metric-box">
              <div className="text-sm text-slate-500">{report.title}</div>
              <div className="mt-3 text-2xl font-bold text-slate-900">{report.value}</div>
              <span className={`status-pill mt-3 ${report.accent === 'emerald' ? 'bg-emerald-100 text-emerald-700' : report.accent === 'amber' ? 'bg-amber-100 text-amber-700' : report.accent === 'sky' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'}`}>
                View / Filter / Print
              </span>
            </div>
          ))}
        </section>

        <section className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Report categories</h2>
            <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">Export Excel</button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Sales', 'Daily sales / monthly sales / return summaries'],
              ['Inventory', 'Current stock / valuation / movement / low stock'],
              ['Financial', 'Profit / loss / expenses / customer and supplier balances'],
              ['Workshop', 'Pending / completed / cancelled / employee payments'],
              ['Customers', 'Outstanding / payments / purchased items'],
              ['Promotions', 'Share product promotions via WhatsApp and Facebook'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 text-lg font-bold text-slate-900">{title}</div>
                <div className="text-sm text-slate-600">{description}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
