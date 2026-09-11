'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const validUsers = [
  { value: 'admin', label: 'Admin', password: 'admin123' },
  { value: 'owner', label: 'Owner', password: 'owner123' },
  { value: 'user', label: 'User', password: 'user123' },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: selectedUser, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed. Please try again.');
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('Unable to connect to the login service.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f5f1] p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft lg:grid-cols-2">
        <div className="bg-[#0f172a] p-10 text-white">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d4af37] text-xl font-bold text-slate-900">
              W
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-slate-300">WCS</div>
              <div className="text-2xl font-bold">Inventory Invoice</div>
            </div>
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight">Jewellery business control, simplified.</h1>
          <p className="max-w-sm text-slate-300">
            Manage invoices, inventory, workshop operations, customer balances, and product promotion from one secure platform.
          </p>

          <div className="mt-10 space-y-4">
            {[
              'Multi-tenant business workspace',
              'Invoices, stock and workshop flow',
              'WhatsApp-ready customer communication',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/30 px-4 py-3 text-sm text-slate-200">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d4af37] text-xs font-bold text-slate-900">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-8">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d4af37]">Login</div>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Welcome back</h2>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">User</label>
              <select
                value={selectedUser}
                onChange={(event) => setSelectedUser(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-[#d4af37]"
              >
                {validUsers.map((user) => (
                  <option key={user.value} value={user.value}>
                    {user.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-[#d4af37]"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-slate-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 accent-[#d4af37]" />
                Remember me
              </label>
              <button type="button" className="font-medium text-[#0f172a]">Forgot password?</button>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#0f172a] px-4 py-3 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Signing in...' : 'Login'}
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Language: <span className="font-medium text-slate-800">English / Sinhala / Tamil</span>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
