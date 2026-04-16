"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/trial-sites", label: "Trial Sites" },
  { href: "/cohort-search-assistant", label: "Cohort Assistant" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-slate-200 bg-white/95 backdrop-blur md:min-h-screen md:w-72 md:border-r md:border-b-0">
      <div className="border-b border-slate-100 px-5 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-600">TrialFlow AI</p>
        <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
          Operations Console
        </h1>
        <p className="mt-1 text-sm text-slate-500">Clinical trial site intelligence</p>
      </div>

      <nav className="px-3 py-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Navigation</p>
        <ul className="space-y-1.5">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-sky-50 text-sky-700 shadow-sm ring-1 ring-sky-100"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
