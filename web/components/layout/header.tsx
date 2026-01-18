"use client";

import { Menu, Store, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { NAV_ITEMS } from "@/constants/nav-items";
import { HeaderNavAuth } from "./header-nav-auth";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-100">
      <nav
        className={`border-b transition-all duration-300 ${
          scrolled
            ? "border-slate-200 bg-white/90 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-400 items-center px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="relative">
                <div className="rounded-xl bg-indigo-600 p-1.5 shadow-lg shadow-indigo-100 transition-transform group-hover:rotate-12">
                  <Store className="h-5 w-5 text-white" />
                </div>

                <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full border-2 border-white bg-indigo-400" />
              </div>

              <div className="flex flex-col leading-none">
                <span className="text-lg font-black tracking-tighter text-slate-950 uppercase italic">
                  My<span className="text-indigo-600">Ecommerce</span>
                </span>

                <span className="text-[8px] font-black tracking-[0.3em] text-slate-400 uppercase">
                  Sistema SaaS de Lojas
                </span>
              </div>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="hidden items-center gap-8 lg:flex">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group relative text-[10px] font-black tracking-widest text-slate-500 uppercase transition-colors hover:text-indigo-600"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-indigo-600 transition-all group-hover:w-full" />
                </Link>
              ))}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden lg:block">
              <HeaderNavAuth />
            </div>

            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-950 lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="absolute inset-x-0 top-full h-screen bg-white p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 lg:hidden">
            <div className="flex flex-col gap-6 items-center">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-2xl font-black uppercase italic text-slate-950"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <hr className="w-full border-slate-100" />

              <HeaderNavAuth
                isMobile
                onActionClick={() => setIsMenuOpen(false)}
              />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
