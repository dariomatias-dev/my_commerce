import type { Metadata } from "next";

import "./globals.css";

import { AuthProvider } from "@/contexts/auth-context";

export const metadata: Metadata = {
  title: "My Ecommerce",
  description:
    "A complete and scalable SaaS solution for small business owners to create and manage their online stores.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: Readonly<RootLayoutProps>) => {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
