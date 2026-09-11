const brandingFields = [
  'Company name',
  'Address',
  'Telephone',
  'WhatsApp',
  'Email',
  'Logo JPG',
  'Invoice heading',
  'Report heading',
  'Footer text',
  'Terms & conditions',
];

const printOptions = ['80mm thermal', '58mm POS thermal', 'A4'];

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-800">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Settings</p>
          <h1 className="text-3xl font-bold text-slate-900">Business branding and printing</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Branding</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {brandingFields.map((field) => (
                <div key={field}>
                  <label className="mb-2 block text-sm font-medium text-slate-700">{field}</label>
                  <input className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-700 outline-none focus:border-[#d4af37]" defaultValue={field} />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h2 className="mb-4 text-xl font-bold text-slate-900">Print template</h2>
              <div className="space-y-3">
                {printOptions.map((option) => (
                  <div key={option} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <span className="font-medium text-slate-700">{option}</span>
                    <input type="radio" name="print-type" defaultChecked={option === 'A4'} className="h-4 w-4 accent-[#d4af37]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="mb-4 text-xl font-bold text-slate-900">Template actions</h2>
              <div className="space-y-2">
                {['Import invoice paper JPG', 'Print invoice', 'Reprint invoice', 'Download certificate', 'Print order'].map((action) => (
                  <button key={action} type="button" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left text-sm font-medium text-slate-700 hover:border-[#d4af37] hover:bg-[#f8f5f1]">
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
