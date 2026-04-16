import type { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen md:flex">
      <AppSidebar />
      <main className="flex-1 p-5 md:p-8">{children}</main>
    </div>
  );
}
