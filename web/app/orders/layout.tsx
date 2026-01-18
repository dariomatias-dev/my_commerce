"use client";

import { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

interface OrdersLayoutProps {
  children: ReactNode;
}

const OrdersLayout = ({ children }: OrdersLayoutProps) => {
  return (
    <>
      <Header />

      <main className="w-full min-h-screen bg-[#F4F7FA] font-sans text-slate-900">
        <div className="mx-auto max-w-400 px-6 pt-32 pb-20">{children}</div>
      </main>

      <Footer />
    </>
  );
};

export default OrdersLayout;
