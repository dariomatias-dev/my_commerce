import type { Metadata } from "next";

import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
