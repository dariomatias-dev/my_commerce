"use client";

import { ReactNode } from "react";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Footer } from "@/components/layout/footer";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <DashboardHeader />

      <main className="w-full min-h-screen bg-[#F4F7FA] font-sans text-slate-900">
        <div className="mx-auto max-w-400 px-6 pt-32 pb-20">{children}</div>
      </main>

      <Footer />
    </>
  );
};

export default DashboardLayout;
