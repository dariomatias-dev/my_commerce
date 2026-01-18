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

      <main className="w-full min-h-screen bg-[#F4F7FA] font-sans text-slate-900">
        <div className="mx-auto max-w-400 px-6 pt-32 pb-20">{children}</div>
      </main>

      <Footer />
    </>
  );
};

export default AdminLayout;
