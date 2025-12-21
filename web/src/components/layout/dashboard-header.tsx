"use client";

import { Bell, Search, Store, Zap } from "lucide-react";
import Link from "next/link";

import { UserProfileDropdown } from "../user-profile-dropdown";

export const DashboardHeader = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-6">
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

        <div className="hidden max-w-md flex-1 px-10 md:block">
          <div className="group relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
            <input
              type="text"
              placeholder="Pesquisar comandos, pedidos ou SKUs..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pr-4 pl-10 text-xs font-bold transition-all outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-all hover:border-indigo-600 hover:text-indigo-600">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full border-2 border-white bg-indigo-600" />
          </button>

          <UserProfileDropdown />
        </div>
      </div>
    </header>
  );
};
