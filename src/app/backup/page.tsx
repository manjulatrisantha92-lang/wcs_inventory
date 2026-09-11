export default function BackupPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-800">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Backup</p>
          <h1 className="text-3xl font-bold text-slate-900">Backup & restore</h1>
        </div>

        <div className="card">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">MongoDB export backup</h2>
            <button type="button" className="rounded-xl bg-[#0f172a] px-4 py-2.5 font-semibold text-white">Create backup</button>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Last backup</span>
              <span className="font-semibold text-slate-800">10/09/2026 14:30</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <button type="button" className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700">Download backup</button>
              <button type="button" className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700">Upload backup</button>
              <button type="button" className="rounded-xl bg-[#d4af37] px-4 py-3 font-semibold text-slate-900">Restore backup</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
