import Link from "next/link";
import { SiteStatusBadge } from "@/components/site-status-badge";
import { trialSites } from "@/lib/trial-sites";

export default function TrialSitesPage() {
  const hasSites = trialSites.length > 0;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Site Network</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Trial Sites</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Browse all sites and drill into enrollment, cohorts, and site-level updates.
          </p>
        </div>
        <input
          type="search"
          placeholder="Search sites by name, region, or PI (demo)"
          className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 md:w-80"
          readOnly
        />
      </header>

      {hasSites ? (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                <th className="px-5 py-3">Site</th>
                <th className="px-5 py-3">Principal Investigator</th>
                <th className="px-5 py-3">Therapeutic Area</th>
                <th className="px-5 py-3">Enrollment</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trialSites.map((site) => (
                <tr key={site.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">{site.name}</p>
                    <p className="text-xs text-slate-500">{site.location}</p>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{site.principalInvestigator}</td>
                  <td className="px-5 py-4 text-slate-600">{site.therapeuticArea}</td>
                  <td className="px-5 py-4 text-slate-600">
                    {site.enrolledPatients} / {site.enrollmentTarget}
                  </td>
                  <td className="px-5 py-4">
                    <SiteStatusBadge status={site.status} />
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/trial-sites/${site.id}`}
                      className="inline-flex items-center text-sm font-medium text-sky-700 transition hover:text-sky-900"
                    >
                      Open site
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">No trial sites available</h3>
          <p className="mt-2 text-sm text-slate-600">
            Seed data has not been loaded yet. Add mock sites to populate the network table.
          </p>
        </section>
      )}
    </div>
  );
}
