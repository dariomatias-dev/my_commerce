"use client";

import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Flame,
  Heart,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState } from "react";

import { Footer } from "@/components/layout/footer";

const STORE_DATA = {
  name: "TITAN HUB",
  logo: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400",
  banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
};

const CATEGORIES = ["Todos", "Sneakers", "Acessórios", "Tech", "Lifestyle"];

const PRODUCTS = [
  {
    id: "1",
    name: "Alpha Urban Runner",
    price: 499.9,
    oldPrice: 599.9,
    category: "Sneakers",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    isNew: true,
    isBestSeller: true,
    stock: 45,
  },
  {
    id: "2",
    name: "Titanium Fusion Watch",
    price: 899.0,
    category: "Tech",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    isBestSeller: true,
    stock: 2,
  },
  {
    id: "3",
    name: "Vortex Backpack v2",
    price: 299.9,
    category: "Acessórios",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    isLastUnits: true,
    stock: 3,
  },
  {
    id: "4",
    name: "Eclipse Stealth Case",
    price: 89.9,
    category: "Tech",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    isNew: true,
    stock: 100,
  },
  {
    id: "5",
    name: "Neo-Grip Hybrid",
    price: 159.0,
    oldPrice: 199.0,
    category: "Sneakers",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
    isBestSeller: true,
    stock: 12,
  },
  {
    id: "6",
    name: "Core Minimalist Wallet",
    price: 120.0,
    category: "Acessórios",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93",
    isLastUnits: true,
    stock: 1,
  },
];

const Badge = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "hot" | "warning" | "new";
}) => {
  const styles = {
    default: "bg-slate-100 text-slate-600",
    hot: "bg-indigo-600 text-white shadow-lg shadow-indigo-200",
    warning: "bg-orange-500 text-white shadow-lg shadow-orange-200",
    new: "bg-emerald-500 text-white shadow-lg shadow-emerald-200",
  };
  return (
    <div
      className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 ${styles[variant]}`}
    >
      {children}
    </div>
  );
};

const ProductCard = ({ product }: { product: (typeof PRODUCTS)[0] }) => (
  <div className="group relative flex flex-col rounded-[3rem] border-2 border-slate-100 bg-white p-5 transition-all hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-500/10 focus-within:border-indigo-600 outline-none">
    <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-slate-50">
      <Image
        src={product.image}
        alt={product.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute top-5 left-5 flex flex-col gap-2">
        {product.isNew && (
          <Badge variant="new">
            <Sparkles size={10} /> Novo
          </Badge>
        )}
        {product.isBestSeller && (
          <Badge variant="hot">
            <Flame size={10} /> Best Seller
          </Badge>
        )}
        {product.isLastUnits && (
          <Badge variant="warning">
            <Clock size={10} /> Últimas Unidades
          </Badge>
        )}
      </div>
      <button className="absolute bottom-5 right-5 h-14 w-14 flex items-center justify-center rounded-[1.5rem] bg-white/90 backdrop-blur-md shadow-xl text-slate-950 transition-all hover:bg-indigo-600 hover:text-white translate-y-24 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 border-2 border-transparent focus:border-indigo-600 outline-none">
        <Plus size={28} />
      </button>
    </div>
    <div className="mt-7 px-2">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
        {product.category}
      </span>
      <h3 className="mt-1 text-2xl font-black tracking-tighter text-slate-950 uppercase italic leading-tight group-hover:text-indigo-600 transition-colors">
        {product.name}
      </h3>
      <div className="mt-5 flex items-center gap-4">
        <span className="text-2xl font-black tracking-tighter text-slate-950">
          R$ {product.price.toFixed(2)}
        </span>
        {product.oldPrice && (
          <span className="text-sm font-bold text-slate-300 line-through">
            R$ {product.oldPrice.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  </div>
);

const StorefrontPage = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          (activeCategory === "Todos" || p.category === activeCategory) &&
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [activeCategory, searchQuery]
  );

  const bestSellers = useMemo(() => PRODUCTS.filter((p) => p.isBestSeller), []);
  const lastUnits = useMemo(() => PRODUCTS.filter((p) => p.isLastUnits), []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <header className="sticky top-0 z-100 border-b-2 border-slate-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-24 max-w-400 items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl bg-slate-950 border-2 border-slate-100">
              <Image
                src={STORE_DATA.logo}
                alt="Logo"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-2xl font-black tracking-tighter uppercase italic text-slate-950">
                {STORE_DATA.name.split(" ")[0]}
                <span className="text-indigo-600">
                  {STORE_DATA.name.split(" ")[1]}
                </span>
              </span>
              <span className="text-[9px] font-black tracking-[0.3em] text-slate-400 uppercase">
                Revendedor Autorizado
              </span>
            </div>
          </div>

          <div className="hidden max-w-xl flex-1 px-12 lg:block">
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Pesquisar no catálogo..."
                className="w-full rounded-2xl border-slate-100 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm font-bold outline-none border-2 focus:border-indigo-600 focus:bg-white transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:text-indigo-600 transition-all outline-none focus:border-indigo-600">
              <Heart size={22} />
            </button>
            <button className="group relative flex h-14 items-center gap-4 rounded-2xl bg-slate-950 px-8 text-white transition-all hover:bg-indigo-600 active:scale-95 border-2 border-transparent focus:border-indigo-600 outline-none">
              <ShoppingBag size={22} />
              <span className="text-xs font-black tracking-[0.2em] uppercase italic">
                Sacola
              </span>
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500 text-xs font-black shadow-lg">
                2
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-400 px-8">
        <section className="py-10">
          <div className="relative h-162.5 w-full overflow-hidden rounded-[4rem] bg-slate-950 text-white shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f"
              alt="Hero Banner"
              fill
              priority
              className="object-cover opacity-50 mix-blend-luminosity transition-transform duration-[10s] hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/60 to-transparent" />

            <div className="relative z-10 flex h-full flex-col justify-center p-12 lg:p-24">
              <div className="flex items-center gap-3">
                <div className="h-px w-12 bg-indigo-500" />
                <span className="text-xs font-black tracking-[0.5em] text-indigo-400 uppercase">
                  Season 2025 Release
                </span>
              </div>
              <h1 className="mt-8 text-7xl font-black leading-[0.85] tracking-tighter uppercase italic md:text-9xl max-w-4xl">
                HIGH-SPEED <br />{" "}
                <span className="text-indigo-600">COMMERCE.</span>
              </h1>
              <p className="mt-10 max-w-xl text-xl font-medium leading-relaxed text-slate-300 italic">
                Performance bruta e design meticuloso. A nova linha de
                periféricos e sneakers Titan já está disponível para deployment
                imediato.
              </p>
              <div className="mt-14 flex flex-wrap gap-5">
                <button className="rounded-2xl bg-white px-12 py-6 text-xs font-black tracking-[0.3em] text-slate-950 uppercase transition-all hover:bg-indigo-600 hover:text-white active:scale-95 outline-none ring-4 ring-transparent focus:ring-white/20">
                  Explorar Catálogo
                </button>
                <button className="flex items-center gap-3 rounded-2xl border-2 border-white/20 bg-white/5 px-10 py-6 text-xs font-black tracking-[0.3em] uppercase backdrop-blur-md transition-all hover:bg-white/10 active:scale-95 outline-none">
                  Ver Coleção <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 border-b border-slate-100">
          <div className="mb-16 flex items-end justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-indigo-600">
                <Flame size={20} fill="currentColor" />
                <span className="text-[10px] font-black tracking-[0.4em] uppercase">
                  Mundo Tech
                </span>
              </div>
              <h2 className="text-6xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
                MAIS <span className="text-indigo-600">VENDIDOS.</span>
              </h2>
            </div>
            <div className="flex gap-3">
              <button className="h-14 w-14 flex items-center justify-center rounded-2xl border-2 border-slate-100 hover:border-indigo-600 transition-all outline-none focus:border-indigo-600">
                <ChevronLeft size={24} />
              </button>
              <button className="h-14 w-14 flex items-center justify-center rounded-2xl border-2 border-slate-100 hover:border-indigo-600 transition-all outline-none focus:border-indigo-600">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <section className="py-24">
          <div className="relative overflow-hidden rounded-[4rem] bg-slate-50 border-2 border-slate-100 p-12 lg:p-24">
            <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
              <div className="relative aspect-square overflow-hidden rounded-[3.5rem] bg-white shadow-2xl ring-1 ring-slate-100">
                <Image
                  src={PRODUCTS[1].image}
                  alt="Spotlight"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-tr from-slate-950/10 to-transparent" />
              </div>

              <div className="space-y-12">
                <div>
                  <Badge variant="hot">
                    Estatística de Vendas: +150% este mês
                  </Badge>
                  <h2 className="mt-8 text-7xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
                    {PRODUCTS[1].name}
                  </h2>
                  <p className="mt-10 text-2xl font-medium leading-relaxed text-slate-500 italic">
                    O ápice da engenharia wearable. Equipado com sensores de
                    fusão e corpo em titânio grau 5. Uma peça que transcende o
                    tempo e a tecnologia convencional.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-12 py-10 border-y-2 border-slate-200">
                  <div>
                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em]">
                      Hardware
                    </p>
                    <p className="mt-2 text-2xl font-black text-slate-950 italic">
                      Titânio Aero
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em]">
                      Garantia
                    </p>
                    <p className="mt-2 text-2xl font-black text-slate-950 italic">
                      Full Service
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-8">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Preço Sugerido
                    </span>
                    <span className="text-5xl font-black tracking-tighter text-slate-950 italic">
                      R$ {PRODUCTS[1].price.toFixed(2)}
                    </span>
                  </div>
                  <button className="group flex items-center gap-5 rounded-[2rem] bg-indigo-600 px-12 py-7 text-white shadow-2xl shadow-indigo-200 transition-all hover:bg-slate-950 active:scale-95 outline-none">
                    <span className="text-sm font-black tracking-[0.2em] uppercase">
                      Adicionar ao Carrinho
                    </span>
                    <ArrowRight
                      size={22}
                      className="transition-transform group-hover:translate-x-2"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 border-b border-slate-100">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="rounded-[3.5rem] border-2 border-orange-100 bg-orange-50/20 p-12">
              <div className="mb-12 flex items-center justify-between">
                <h3 className="text-4xl font-black tracking-tighter text-orange-600 uppercase italic">
                  ÚLTIMAS <span className="text-slate-950">UNIDADES.</span>
                </h3>
                <div className="h-3 w-3 rounded-full bg-orange-500 animate-pulse" />
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                {lastUnits.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>

            <div className="rounded-[3.5rem] border-2 border-emerald-100 bg-emerald-50/20 p-12">
              <div className="mb-12 flex items-center justify-between">
                <h3 className="text-4xl font-black tracking-tighter text-emerald-600 uppercase italic">
                  NEW <span className="text-slate-950">ENTRIES.</span>
                </h3>
                <Sparkles size={32} className="text-emerald-500" />
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                {PRODUCTS.slice(3, 5).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-24" id="shop">
          <div className="mb-20 flex flex-col gap-10 md:flex-row md:items-center md:justify-between border-b-2 border-slate-950 pb-12">
            <div className="space-y-6">
              <h2 className="text-6xl font-black tracking-tighter text-slate-950 uppercase italic">
                CATÁLOGO <span className="text-indigo-600">GERAL.</span>
              </h2>
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-xl px-8 py-3 text-[11px] font-black tracking-[0.3em] uppercase transition-all border-2 border-transparent focus:border-indigo-600 outline-none ${
                      activeCategory === cat
                        ? "bg-slate-950 text-white shadow-2xl"
                        : "bg-white text-slate-400 border-2 border-slate-100 hover:border-indigo-600 hover:text-slate-950"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white px-8 py-5 text-xs font-black tracking-widest uppercase hover:border-indigo-600 transition-all focus:border-indigo-600 outline-none">
                <Filter size={18} /> Filtrar
              </button>
              <button className="flex items-center gap-3 rounded-2xl border-2 bg-white px-8 py-5 text-xs font-black tracking-widest uppercase hover:border-indigo-600 transition-all border-transparent focus:border-indigo-600 outline-none">
                Ordenar <ChevronDown size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-40 text-center">
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-slate-200">
                <Search size={40} />
              </div>
              <h3 className="mt-8 text-2xl font-black uppercase italic text-slate-300">
                Nenhum registro localizado
              </h3>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StorefrontPage;
