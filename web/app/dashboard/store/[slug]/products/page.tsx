"use client";

import {
  ArrowLeft,
  Edit3,
  Filter,
  Package,
  Plus,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Footer } from "@/components/layout/footer";

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Alpha Urban Runner",
    sku: "SNK-001",
    price: 499.9,
    stock: 45,
    category: "Sneakers",
    status: "Ativo",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },
  {
    id: "2",
    name: "Titanium Fusion Watch",
    sku: "TCH-042",
    price: 899.0,
    stock: 2,
    category: "Tech",
    status: "Ativo",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  },
  {
    id: "3",
    name: "Vortex Backpack v2",
    sku: "ACC-088",
    price: 299.9,
    stock: 0,
    category: "Acessórios",
    status: "Inativo",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
  },
  {
    id: "4",
    name: "Eclipse Stealth Case",
    sku: "TCH-009",
    price: 89.9,
    stock: 120,
    category: "Tech",
    status: "Ativo",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  },
];

const MOCK_CATEGORIES = [
  { id: "1", name: "Sneakers", count: 12, status: "Ativo" },
  { id: "2", name: "Tech", count: 8, status: "Ativo" },
  { id: "3", name: "Acessórios", count: 24, status: "Ativo" },
  { id: "4", name: "Lifestyle", count: 5, status: "Inativo" },
];

export default function StoreInventoryPage() {
  const { slug } = useParams() as { slug: string };
  const [view, setView] = useState<"products" | "categories">("products");

  return (
    <>
      <DashboardHeader />

      <main className="min-h-screen bg-[#F4F7FA] font-sans text-slate-900 mx-auto max-w-400 px-6 pt-32 pb-12">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-10 flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end">
            <div>
              <Link
                href={`/dashboard/store/${slug}`}
                className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft size={14} /> Voltar ao Console
              </Link>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-5 items-center rounded bg-slate-950 px-2 text-[9px] font-black tracking-widest text-white uppercase">
                  Gestão de Ativos
                </div>
                <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase italic">
                  {slug.replace("-", " ")}
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic">
                INVENTÁRIO <span className="text-indigo-600">CENTRAL.</span>
              </h1>
            </div>

            <div className="flex w-full flex-wrap gap-3 lg:w-auto">
              <div className="flex rounded-xl bg-slate-200/50 p-1">
                <button
                  onClick={() => setView("products")}
                  className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all rounded-lg ${
                    view === "products"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Package size={14} /> Produtos
                </button>
                <button
                  onClick={() => setView("categories")}
                  className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all rounded-lg ${
                    view === "categories"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Tag size={14} /> Categorias
                </button>
              </div>
              <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-4 text-[10px] font-black tracking-widest text-white shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 border-2 border-transparent focus:border-indigo-400 outline-none">
                <Plus size={16} />{" "}
                {view === "products" ? "NOVO PRODUTO" : "NOVA CATEGORIA"}
              </button>
            </div>
          </div>

          <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder={
                  view === "products"
                    ? "Buscar por nome, SKU ou ID..."
                    : "Buscar categoria..."
                }
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 pl-12 pr-4 text-xs font-bold text-slate-950 outline-none transition-all focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5"
              />
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 rounded-xl border-2 border-slate-100 bg-white px-5 py-3.5 text-[10px] font-black tracking-widest text-slate-500 uppercase hover:border-indigo-600 hover:text-indigo-600 transition-all outline-none focus:ring-4 focus:ring-indigo-600/5">
                <Filter size={16} /> Filtros Avançados
              </button>
            </div>
          </section>

          {view === "products" ? (
            <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">
                      <th className="py-5 pl-10">Ativo / SKU</th>
                      <th className="py-5">Categoria</th>
                      <th className="py-5 text-center">Status</th>
                      <th className="py-5 text-center">Estoque</th>
                      <th className="py-5">Preço Unitário</th>
                      <th className="py-5 pr-10 text-right">Controle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {MOCK_PRODUCTS.map((product) => (
                      <tr
                        key={product.id}
                        className="group hover:bg-indigo-50/20 transition-colors"
                      >
                        <td className="py-6 pl-10">
                          <div className="flex items-center gap-5">
                            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-50 group-hover:border-indigo-200">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-950 uppercase italic tracking-tight">
                                {product.name}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {product.sku}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 text-xs font-black text-slate-500 uppercase tracking-widest">
                          {product.category}
                        </td>
                        <td className="py-6 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[9px] font-black tracking-widest uppercase ${
                              product.status === "Ativo"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="py-6 text-center">
                          <p
                            className={`text-sm font-black italic ${
                              product.stock === 0
                                ? "text-red-500"
                                : product.stock < 10
                                ? "text-orange-500"
                                : "text-slate-950"
                            }`}
                          >
                            {product.stock}{" "}
                            <span className="text-[10px] font-bold text-slate-400 not-italic">
                              UN
                            </span>
                          </p>
                        </td>
                        <td className="py-6 font-black text-slate-950 italic">
                          R$ {product.price.toFixed(2)}
                        </td>
                        <td className="py-6 pr-10 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-100 bg-white text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all outline-none focus:ring-4 focus:ring-indigo-600/5">
                              <Edit3 size={18} />
                            </button>
                            <button className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-100 bg-white text-slate-400 hover:text-red-500 hover:border-red-500 transition-all outline-none focus:ring-4 focus:ring-red-600/5">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {MOCK_CATEGORIES.map((category) => (
                <div
                  key={category.id}
                  className="group relative rounded-[2.5rem] border-2 border-slate-200 bg-white p-8 transition-all hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Tag size={24} />
                    </div>
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest ${
                        category.status === "Ativo"
                          ? "text-emerald-500"
                          : "text-slate-300"
                      }`}
                    >
                      {category.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    {category.count} Produtos Vinculados
                  </p>

                  <div className="mt-8 flex gap-2 border-t border-slate-50 pt-6">
                    <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-100 py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-indigo-600 hover:text-indigo-600 transition-all">
                      <Edit3 size={14} /> Editar
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-500 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
