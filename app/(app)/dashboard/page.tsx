import Link from "next/link";
import { SiteStatusBadge } from "@/components/site-status-badge";
import {
  dashboardOverview,
  trialSiteFeasibilityRankings,
} from "@/lib/trial-sites";

export default function DashboardPage() {
  const topSites = trialSiteFeasibilityRankings.slice(0, 5);

  const dashboardStats = [
    {
      label: "Total Sites",
      value: dashboardOverview.totalSites.toString(),
      detail: "Configured trial sites in network",
    },
    {
      label: "Average Feasibility Score",
      value: `${dashboardOverview.averageFeasibilityScore.toFixed(1)}`,
      detail: "Weighted across operational inputs",
    },
    {
      label: "At-Risk Sites",
      value: dashboardOverview.atRiskSites.toString(),
      detail: "High-risk tier based on feasibility",
    },
    {
      label: "Projected Monthly Enrollment",
      value: dashboardOverview.projectedMonthlyEnrollment.toFixed(1),
      detail: "Participants per month (network-wide)",
    },
  ];

  return (
    <div className="space-y-10">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Operations Overview</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Site Feasibility Dashboard</h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Enterprise-style snapshot of network readiness, risk signals, and projected enrollment output.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm transition hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-500">{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.9fr,1fr]">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">Top 5 Sites by Feasibility Score</h3>
              <p className="text-sm text-slate-500">
                Ranked by startup speed, patient depth, enrollment history, retention, and trial experience.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Rank</th>
                  <th className="px-5 py-3">Site</th>
                  <th className="px-5 py-3">Region</th>
                  <th className="px-5 py-3">Therapeutic Area</th>
                  <th className="px-5 py-3 text-right">Feasibility</th>
                  <th className="px-5 py-3 text-right">Monthly Enrollment</th>
                  <th className="px-5 py-3">Risk Tier</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topSites.map((entry, index) => (
                  <tr key={entry.site.id} className="hover:bg-slate-50/60">
                    <td className="px-5 py-4 text-slate-500">#{index + 1}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">{entry.site.name}</p>
                      <p className="text-xs text-slate-500">{entry.site.principalInvestigator}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{entry.site.region}</td>
                    <td className="px-5 py-4 text-slate-600">{entry.site.therapeuticArea}</td>
                    <td className="px-5 py-4 text-right">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                        {entry.feasibilityScore}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-medium text-slate-900">
                      {entry.projectedMonthlyEnrollment.toFixed(1)}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          entry.riskTier === "Low"
                            ? "bg-emerald-100 text-emerald-700"
                            : entry.riskTier === "Moderate"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {entry.riskTier}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <SiteStatusBadge status={entry.site.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Enrollment Outlook</h3>
            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {dashboardOverview.projectedMonthlyEnrollment.toFixed(1)}
            </p>
            <p className="mt-1 text-sm text-slate-500">Projected monthly participants across all sites</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900">Network Health</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-sm text-slate-600">Active + Recruiting</span>
                <span className="text-sm font-semibold text-slate-900">{topSites.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-sm text-slate-600">At-Risk Sites</span>
                <span className="text-sm font-semibold text-rose-700">
                  {dashboardOverview.atRiskSites}
                </span>
              </div>
            </div>
            <Link
              href="/trial-sites"
              className="mt-4 inline-flex text-sm font-medium text-sky-700 transition hover:text-sky-900"
            >
              View all sites →
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
