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

      {children}

      <Footer />
    </>
  );
};

export default DashboardLayout;
