import { Store, Zap } from "lucide-react";
import Link from "next/link";

import { UserProfileDropdown } from "../user-profile-dropdown";

export const DashboardHeader = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-100 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-400 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="group flex items-center gap-2.5">
            <div className="rounded-xl bg-indigo-600 p-1.5 shadow-lg shadow-indigo-100 transition-transform group-hover:rotate-12">
              <Store className="h-5 w-5 text-white" />
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-lg font-black tracking-tighter text-slate-950 uppercase italic">
                My<span className="text-indigo-600">Ecommerce</span>
              </span>

              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

                <span className="text-[8px] font-black tracking-[0.2em] text-slate-400 uppercase">
                  Sistema Operacional
                </span>
              </div>
            </div>
          </Link>

          <div className="hidden h-8 w-px bg-slate-200 lg:block" />

          <div className="hidden items-center gap-4 lg:flex">
            <div className="flex items-center gap-2 rounded-full border border-slate-100 bg-slate-50 px-3 py-1">
              <Zap size={10} className="text-indigo-600" />

              <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase">
                v2.4.0-stable
              </span>
            </div>
          </div>
        </div>

        <UserProfileDropdown />
      </div>
    </header>
  );
};
