const products = [
  { name: 'Gold Ring', price: 'Rs. 125,000', tag: 'New arrival' },
  { name: 'Pearl Necklace', price: 'Rs. 185,000', tag: 'Featured' },
  { name: 'Diamond Pendant', price: 'Rs. 240,000', tag: 'Limited' },
];

export default function PromotionsPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-800">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Promotions</p>
            <h1 className="text-3xl font-bold text-slate-900">Product promotion share</h1>
          </div>
          <button type="button" className="rounded-xl bg-[#0f172a] px-4 py-2.5 font-semibold text-white">Create promotion</button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.name} className="card">
              <div className="mb-3 flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f8f5f1] to-[#e2e8f0] text-4xl">💎</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-slate-900">{product.name}</div>
                  <div className="text-sm text-slate-500">{product.tag}</div>
                </div>
                <span className="rounded-full bg-[#d4af37]/15 px-2.5 py-1 text-xs font-semibold text-[#8a6b11]">Hot</span>
              </div>
              <div className="mt-4 text-xl font-bold text-[#d4af37]">{product.price}</div>
              <div className="mt-4 flex gap-2">
                <button type="button" className="flex-1 rounded-xl bg-[#0f172a] px-3 py-2.5 text-sm font-semibold text-white">WhatsApp</button>
                <button type="button" className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700">Facebook</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
