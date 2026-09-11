'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navigation = [
  { label: 'Dashboard', href: '/', icon: '🏠' },
  { label: 'Invoice', href: '/invoice', icon: '🧾' },
  { label: 'Inventory', href: '/inventory', icon: '💎' },
  { label: 'Purchasing', href: '/orders', icon: '🛒' },
  { label: 'Customers', href: '/customers', icon: '👤' },
  { label: 'Jewellery Orders', href: '/orders', icon: '💍' },
  { label: 'Workshop', href: '/workshop', icon: '🔧' },
  { label: 'Certificates', href: '/certificates', icon: '📜' },
  { label: 'Reports', href: '/reports', icon: '📊' },
  { label: 'Promotions', href: '/promotions', icon: '📢' },
  { label: 'Users', href: '/settings', icon: '👥' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
  { label: 'Backup', href: '/backup', icon: '💾' },
];

function getInitials(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'A';
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/login') {
    return <>{children}</>;
  }

  const user = {
    name: 'System Admin',
    email: 'admin@wcs.lk',
    role: 'Admin',
  };

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

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
            {navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`sidebar-link w-full ${active ? 'bg-[#1e293b] text-white' : 'text-slate-300'}`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Business dashboard</p>
              <h1 className="text-2xl font-bold text-slate-900">WCS operations</h1>
            </div>

            <div className="flex items-center gap-4">
              <button type="button" className="rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
                🔔 Alerts
              </button>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d4af37] font-bold text-slate-900">
                  {getInitials(user.name)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.role} • {user.email}</div>
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

          {children}
        </div>
      </div>
    </main>
  );
}
