import { ReactNode } from "react";

interface ProductFormSectionProps {
  children: ReactNode;
}

export const ProductFormSection = ({ children }: ProductFormSectionProps) => (
  <section className="rounded-[2.5rem] border-2 border-slate-200 bg-white p-8 shadow-sm md:p-12">
    {children}
  </section>
);
