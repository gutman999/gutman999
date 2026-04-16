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
    <aside className="w-full border-b border-slate-200 bg-white md:min-h-screen md:w-64 md:border-r md:border-b-0">
      <div className="px-5 py-6">
        <p className="text-sm font-semibold text-sky-600">TrialFlow AI</p>
        <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
          Operations Console
        </h1>
      </div>

      <nav className="px-3 pb-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-sky-50 text-sky-700"
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
