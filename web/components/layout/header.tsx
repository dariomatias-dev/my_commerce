"use client";

import { LayoutDashboard, Menu, Store, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuthContext } from "@/contexts/auth-context";
import { UserProfileDropdown } from "../user-profile-dropdown";

export const Header = () => {
  const { isAuthenticated } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="relative z-100">
      <nav
        className={`fixed inset-x-0 top-0 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md"
            : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative">
              <div className="rounded-xl bg-indigo-600 p-1.5 shadow-lg shadow-indigo-100 transition-transform group-hover:rotate-12">
                <Store className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full border-2 border-white bg-indigo-400" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tighter text-slate-950 uppercase italic">
                My<span className="text-indigo-600">Ecommerce</span>
              </span>
              <span className="text-[8px] font-black tracking-[0.3em] text-slate-400 uppercase">
                Sistema SaaS de Lojas
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-10 lg:flex">
            <div className="flex items-center gap-8 border-r border-slate-100 pr-10">
              {["Funcionalidades", "Planos", "FAQ"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="group relative text-[10px] font-black tracking-widest text-slate-500 uppercase transition-colors hover:text-indigo-600"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-indigo-600 transition-all group-hover:w-full" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-5">
              {isAuthenticated ? (
                <UserProfileDropdown />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-[10px] font-black tracking-widest text-slate-950 uppercase transition-colors hover:text-indigo-600"
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    className="rounded-xl bg-slate-950 px-8 py-3.5 text-[10px] font-black tracking-widest text-white uppercase shadow-2xl shadow-slate-200 transition-all hover:bg-indigo-600 active:scale-95"
                  >
                    Criar Conta
                  </Link>
                </>
              )}
            </div>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-950 lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="animate-in fade-in slide-in-from-top-4 absolute inset-x-0 top-full h-screen bg-white p-6 shadow-2xl lg:hidden">
            <div className="flex flex-col gap-6">
              {["Funcionalidades", "Planos", "FAQ"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-2xl font-black text-slate-950 uppercase italic"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <hr className="border-slate-100" />
              <div className="flex flex-col gap-4">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-indigo-600 font-black tracking-widest text-white uppercase italic"
                  >
                    <LayoutDashboard size={20} /> Painel de Controle
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex h-14 items-center justify-center rounded-2xl border border-slate-200 font-black tracking-widest text-slate-950 uppercase italic"
                    >
                      Fazer Login
                    </Link>
                    <Link
                      href="/signup"
                      className="flex h-14 items-center justify-center rounded-2xl bg-indigo-600 font-black tracking-widest text-white uppercase italic"
                    >
                      Começar Agora
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
