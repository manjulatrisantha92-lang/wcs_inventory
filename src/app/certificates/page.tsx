const certificateRecords = [
  { id: 'CERT-101', customer: 'Nimal Perera', item: 'Gold Ring GR-001', date: '2026-09-10' },
  { id: 'CERT-102', customer: 'Anushka Silva', item: 'Pearl Necklace PN-041', date: '2026-09-08' },
  { id: 'CERT-103', customer: 'Dimuthu Jayasuriya', item: 'Diamond Pendant DP-014', date: '2026-09-05' },
];

export default function CertificatesPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-800">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Certificates</p>
            <h1 className="text-3xl font-bold text-slate-900">Jewellery certificate management</h1>
          </div>
          <button type="button" className="rounded-xl bg-[#0f172a] px-4 py-2.5 font-semibold text-white">+ New certificate</button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Certificate template</h2>
            <div className="space-y-4">
              {[
                ['Certificate number', 'CERT-101'],
                ['Customer details', 'Nimal Perera'],
                ['Item details', 'Gold Ring GR-001'],
                ['Gold purity', '22K'],
                ['Weight', '3.25 g'],
                ['Authorized signature', 'WCS Jewellery Lab'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
                  <div className="mt-1 font-medium text-slate-800">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Recent certificates</h2>
            <div className="space-y-3">
              {certificateRecords.map((record) => (
                <div key={record.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-800">{record.id}</div>
                    <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{record.date}</span>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{record.customer}</div>
                  <div className="mt-2 text-sm font-medium text-[#d4af37]">{record.item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
