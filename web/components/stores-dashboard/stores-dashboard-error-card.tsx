import { ReactNode } from "react";

import { AlertCircle } from "lucide-react";

import { DashboardHeader } from "../layout/dashboard-header";
import { Footer } from "../layout/footer";

interface StoresDashboardErrorCardProps {
  title: string;
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const StoresDashboardErrorCard = ({
  title,
  message,
  icon,
  action,
}: StoresDashboardErrorCardProps) => (
  <>
    <DashboardHeader />

    <main className="mx-auto flex min-h-screen items-center justify-center bg-[#F4F7FA] px-6 pt-40 pb-20">
      <div className="mx-20 flex w-full flex-col items-center justify-center gap-8 rounded-[3rem] border border-red-100 bg-red-50/30 p-16 text-center">
        {icon || <AlertCircle size={64} className="text-red-500" />}

        <div className="max-w-xl space-y-4">
          <h2 className="text-4xl font-black tracking-tighter text-slate-950 uppercase italic">
            {title}
          </h2>
          <p className="text-lg leading-relaxed font-medium text-slate-500 italic">{message}</p>
        </div>

        {action && <div>{action}</div>}
      </div>
    </main>

    <Footer />
  </>
);
