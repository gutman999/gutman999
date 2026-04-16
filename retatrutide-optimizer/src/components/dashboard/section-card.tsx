import { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  subtitle,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur ${className ?? ""}`}
    >
      <header className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            {subtitle}
          </p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
