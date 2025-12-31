import { ElementType, ReactNode } from "react";

interface FormSectionProps {
  title: string;
  icon: ElementType;
  children: ReactNode;
}

export const StoreFormSection = ({
  title,
  icon: Icon,
  children,
}: FormSectionProps) => (
  <section className="rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-sm">
    <div className="mb-8 flex items-center gap-3 border-b border-slate-50 pb-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
        <Icon size={20} />
      </div>
      <h2 className="text-xl font-black tracking-tight text-slate-950 uppercase italic">
        {title}
      </h2>
    </div>

    {children}
  </section>
);
