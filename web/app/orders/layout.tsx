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

      {children}

      <Footer />
    </>
  );
};

export default OrdersLayout;
