import type { SiteStatus } from "@/lib/trial-sites";

const statusStyles: Record<SiteStatus, string> = {
  Planning: "bg-slate-100 text-slate-700",
  Recruiting: "bg-amber-100 text-amber-700",
  Active: "bg-emerald-100 text-emerald-700",
  "At Risk": "bg-rose-100 text-rose-700",
};

type SiteStatusBadgeProps = {
  status: SiteStatus;
};

export function SiteStatusBadge({ status }: SiteStatusBadgeProps) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}>
      {status}
    </span>
  );
}
