"use client";

import { Menu, Store, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { StoreResponse } from "@/@types/store/store-response";
import { HeaderNavAuth } from "@/components/layout/header-nav-auth";
import { StoreCart } from "./store-cart";

interface StoreHeaderProps {
  store?: StoreResponse | null;
}

export const StoreHeader = ({ store }: StoreHeaderProps) => {
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
            <Link
              href={store ? `/store/${store.slug}` : "/"}
              className="group flex items-center gap-2.5"
            >
              <div className="relative">
                <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-slate-950 shadow-lg transition-transform group-hover:rotate-12 flex items-center justify-center">
                  {store ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}/files/stores/${store.slug}/logo.png`}
                      alt={store.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <Store className="h-5 w-5 text-white" />
                  )}
                </div>

                <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full border-2 border-white bg-indigo-400" />
              </div>

              <div className="flex flex-col leading-none">
                <span className="text-lg font-black tracking-tighter text-slate-950 uppercase italic">
                  {store ? (
                    store.name
                  ) : (
                    <>
                      My<span className="text-indigo-600">Ecommerce</span>
                    </>
                  )}
                </span>

                <span className="text-[8px] font-black tracking-[0.3em] text-slate-400 uppercase">
                  {store ? "Official Store" : "Sistema SaaS"}
                </span>
              </div>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="hidden items-center gap-8 lg:flex">
              {store &&
                ["Produtos", "Categorias", "Sobre"].map((item) => (
                  <Link
                    key={item}
                    href={`/store/${store.slug}`}
                    className="group relative text-[10px] font-black tracking-widest text-slate-500 uppercase transition-colors hover:text-indigo-600"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-indigo-600 transition-all group-hover:w-full" />
                  </Link>
                ))}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-3 lg:flex">
              <div className="flex items-center gap-3 border-r border-slate-100 pr-6 mr-3">
                {store && <StoreCart store={store} />}
              </div>
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
              <div className="flex items-center">
                {store && <StoreCart store={store} />}
              </div>

              <hr className="w-full border-slate-100" />

              {store &&
                ["Produtos", "Categorias", "Sobre"].map((item) => (
                  <Link
                    key={item}
                    href={`/store/${store.slug}`}
                    className="text-2xl font-black uppercase italic text-slate-950"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
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
