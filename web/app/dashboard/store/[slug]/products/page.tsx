"use client";

import {
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Filter,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError } from "@/@types/api";
import { ProductResponse } from "@/@types/product/product-response";
import { StoreResponse } from "@/@types/store/store-response";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Footer } from "@/components/layout/footer";
import { useProduct } from "@/hooks/use-product";
import { useStore } from "@/hooks/use-store";

const MOCK_CATEGORIES = [
  { id: "1", name: "Sneakers", count: 12, status: "Ativo" },
  { id: "2", name: "Tech", count: 8, status: "Ativo" },
  { id: "3", name: "Acessórios", count: 24, status: "Ativo" },
  { id: "4", name: "Lifestyle", count: 5, status: "Inativo" },
];

export default function StoreInventoryPage() {
  const { slug } = useParams() as { slug: string };
  const { getStoreBySlug } = useStore();
  const { getProductsByStoreId } = useProduct();
  const listTopRef = useRef<HTMLDivElement>(null);

  const [view, setView] = useState<"products" | "categories">("products");
  const [store, setStore] = useState<StoreResponse | null>(null);
  const [products, setProducts] = useState<ProductResponse[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const fetchInventory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const storeData = await getStoreBySlug(slug);
      setStore(storeData);

      if (view === "products") {
        const productData = await getProductsByStoreId(
          storeData.id,
          currentPage,
          pageSize
        );
        setProducts(productData.content);
        setTotalPages(productData.totalPages);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Falha ao sincronizar dados do inventário.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [slug, view, currentPage, getStoreBySlug, getProductsByStoreId]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <DashboardHeader />

      <main className="mx-auto max-w-400 px-6 pt-32 pb-12 font-sans text-slate-900 min-h-screen bg-[#F4F7FA]">
        <div
          ref={listTopRef}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-mt-32"
        >
          <div className="mb-10 flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end">
            <div>
              <Link
                href={`/dashboard/store/${slug}`}
                className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft size={14} /> Voltar ao Console
              </Link>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-5 items-center rounded bg-indigo-600 px-2 text-[9px] font-black tracking-widest text-white uppercase">
                  Gestão de Ativos
                </div>
                <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase italic">
                  {store?.name || slug.replace("-", " ")}
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic">
                INVENTÁRIO <span className="text-indigo-600">CENTRAL.</span>
              </h1>
            </div>

            <div className="flex w-full flex-wrap gap-3 lg:w-auto">
              <div className="flex rounded-xl bg-slate-200/50 p-1">
                <button
                  onClick={() => {
                    setView("products");
                    setCurrentPage(0);
                  }}
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
                    ? "Filtrar por nome ou SKU..."
                    : "Filtrar categoria..."
                }
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 pl-12 pr-4 text-xs font-bold text-slate-950 outline-none transition-all focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5"
              />
            </div>
            <button className="flex items-center gap-2 rounded-xl border-2 border-slate-100 bg-white px-5 py-3.5 text-[10px] font-black tracking-widest text-slate-500 uppercase hover:border-indigo-600 hover:text-indigo-600 transition-all outline-none focus:ring-4 focus:ring-indigo-600/5">
              <Filter size={16} /> Parâmetros
            </button>
          </section>

          {isLoading ? (
            <div className="flex min-h-100 flex-col items-center justify-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Sincronizando Banco de Dados...
              </p>
            </div>
          ) : error ? (
            <div className="flex min-h-100 flex-col items-center justify-center gap-6 rounded-[3rem] border border-red-100 bg-red-50/30 p-12 text-center">
              <AlertCircle size={48} className="text-red-500" />
              <div className="max-w-md space-y-2">
                <h2 className="text-xl font-black tracking-tighter text-slate-950 uppercase italic">
                  Erro de Protocolo
                </h2>
                <p className="text-sm font-medium text-slate-500">{error}</p>
              </div>
              <button
                onClick={fetchInventory}
                className="flex items-center gap-2 rounded-xl bg-slate-950 px-8 py-3 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-600"
              >
                <RefreshCw size={14} /> Tentar Novamente
              </button>
            </div>
          ) : view === "products" ? (
            <>
              <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">
                        <th className="py-5 pl-10">Identificação do Ativo</th>
                        <th className="py-5 text-center">Status</th>
                        <th className="py-5 text-center">Volume</th>
                        <th className="py-5">Precificação</th>
                        <th className="py-5 pr-10 text-right">Controle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {products.map((product) => (
                        <tr
                          key={product.id}
                          className="group hover:bg-indigo-50/20 transition-colors"
                        >
                          <td className="py-6 pl-10">
                            <div className="flex items-center gap-5">
                              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-50 group-hover:border-indigo-200">
                                <Package className="h-full w-full p-3 text-slate-300" />
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-950 uppercase italic tracking-tight">
                                  {product.name}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                  {product.slug}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[9px] font-black tracking-widest uppercase ${
                                product.active
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {product.active ? "Operacional" : "Offline"}
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
                              <button className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-100 bg-white text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all outline-none focus:ring-4 focus:ring-indigo-600/5">
                                <Edit3 size={18} />
                              </button>
                              <button className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-100 bg-white text-slate-400 hover:text-red-500 hover:border-red-500 transition-all outline-none focus:ring-4 focus:ring-red-600/5">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-24 text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic"
                          >
                            Nenhum registro localizado no banco de dados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-600 transition-all hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-20 shadow-sm"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`h-12 w-12 rounded-xl text-[11px] font-black transition-all ${
                          currentPage === i
                            ? "bg-slate-950 text-white shadow-2xl scale-110"
                            : "bg-white border-2 border-slate-200 text-slate-400 hover:border-indigo-600 hover:text-indigo-600"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-600 transition-all hover:border-indigo-600 hover:text-indigo-600 disabled:opacity-20 shadow-sm"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
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
                    {category.count} Itens Vinculados
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
