import Link from "next/link";
import { SiteStatusBadge } from "@/components/site-status-badge";
import { trialSites } from "@/lib/trial-sites";

export default function TrialSitesPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-sky-600">Sites</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Trial Sites</h2>
          <p className="mt-2 text-sm text-slate-600">
            Browse all sites and drill into enrollment, cohorts, and site-level updates.
          </p>
        </div>
        <input
          type="search"
          placeholder="Search sites (demo)"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm md:w-72"
          readOnly
        />
      </header>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-4 py-3 font-medium">Site</th>
              <th className="px-4 py-3 font-medium">PI</th>
              <th className="px-4 py-3 font-medium">Area</th>
              <th className="px-4 py-3 font-medium">Enrollment</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {trialSites.map((site) => (
              <tr key={site.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900">{site.name}</p>
                  <p className="text-xs text-slate-500">{site.location}</p>
                </td>
                <td className="px-4 py-3 text-slate-600">{site.principalInvestigator}</td>
                <td className="px-4 py-3 text-slate-600">{site.therapeuticArea}</td>
                <td className="px-4 py-3 text-slate-600">
                  {site.enrolledPatients} / {site.enrollmentTarget}
                </td>
                <td className="px-4 py-3">
                  <SiteStatusBadge status={site.status} />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/trial-sites/${site.id}`}
                    className="font-medium text-sky-700 hover:text-sky-900"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
