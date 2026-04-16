import Link from "next/link";
import { SiteStatusBadge } from "@/components/site-status-badge";
import { dashboardStats, trialSites } from "@/lib/trial-sites";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-sky-600">Overview</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
        <p className="mt-2 text-sm text-slate-600">
          Monitor site performance, enrollment momentum, and operational risk from one place.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <article key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-500">{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Enrollment Snapshot</h3>
            <Link href="/trial-sites" className="text-sm font-medium text-sky-700 hover:text-sky-900">
              View all sites
            </Link>
          </div>

          <div className="space-y-3">
            {trialSites.map((site) => (
              <div
                key={site.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 p-3"
              >
                <div>
                  <p className="font-medium text-slate-900">{site.name}</p>
                  <p className="text-xs text-slate-500">{site.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">
                    {site.enrolledPatients}/{site.enrollmentTarget}
                  </p>
                  <p className="text-xs text-slate-500">Enrolled participants</p>
                </div>
                <SiteStatusBadge status={site.status} />
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-lg border border-slate-100 p-3">
              <p className="font-medium text-slate-900">Review at-risk site alerts</p>
              <p className="text-slate-500">1 site needs escalation this week.</p>
            </li>
            <li className="rounded-lg border border-slate-100 p-3">
              <p className="font-medium text-slate-900">Run cohort pre-screen</p>
              <p className="text-slate-500">
                Use the assistant for eligibility prompts and matching.
              </p>
            </li>
            <li className="rounded-lg border border-slate-100 p-3">
              <p className="font-medium text-slate-900">Prepare sponsor sync</p>
              <p className="text-slate-500">
                Next update scheduled for Friday at 10:00 AM.
              </p>
            </li>
          </ul>
        </article>
      </section>
    </div>
  );
}
