"use client";

import { AdminHeader } from "@/components/layout/admin-header";
import { Footer } from "@/components/layout/footer";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <>
      <AdminHeader />

      {children}

      <Footer />
    </>
  );
};

export default AdminLayout;
