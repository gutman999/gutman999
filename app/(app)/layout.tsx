import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <AppSidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          <section className="rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-white px-5 py-4 shadow-sm">
            <p className="text-sm font-semibold tracking-wide text-sky-700">
              TrialFlow AI
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">
              TrialFlow AI helps study teams select the right sites faster so trials
              enroll sooner and operate with lower execution risk.
            </p>
          </section>
          {children}
        </div>
      </main>
    </div>
  );
}
