import { LucideIcon } from "lucide-react";

type KpiCardProps = {
  title: string;
  value: string;
  tone?: "neutral" | "indigo" | "emerald" | "amber" | "rose";
  helpText?: string;
  icon?: LucideIcon;
};

const toneClasses: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  neutral: "border-slate-200 bg-white",
  indigo: "border-indigo-200 bg-indigo-50/60",
  emerald: "border-emerald-200 bg-emerald-50/60",
  amber: "border-amber-200 bg-amber-50/60",
  rose: "border-rose-200 bg-rose-50/60",
};

export function KpiCard({
  title,
  value,
  tone = "neutral",
  helpText,
  icon: Icon,
}: KpiCardProps) {
  return (
    <article
      className={`rounded-2xl border p-5 shadow-sm shadow-slate-200/60 ${toneClasses[tone]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </p>
        {Icon ? (
          <Icon className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
        ) : null}
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      {helpText ? <p className="mt-2 text-sm text-slate-600">{helpText}</p> : null}
    </article>
  );
}
