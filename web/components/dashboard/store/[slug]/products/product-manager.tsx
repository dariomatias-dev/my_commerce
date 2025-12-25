"use client";

import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Filter,
  Loader2,
  Package,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError } from "@/@types/api";
import { ProductResponse } from "@/@types/product/product-response";
import { useProduct } from "@/services/hooks/use-product";

interface ProductManagerProps {
  storeId: string;
}

export const ProductManager = ({ storeId }: ProductManagerProps) => {
  const { getProductsByStoreId } = useProduct();
  const listTopRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProductsByStoreId(storeId, currentPage, pageSize);
      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Erro ao carregar produtos.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [storeId, currentPage, getProductsByStoreId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
          Sincronizando Ativos...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center gap-6 rounded-[3rem] border border-red-100 bg-red-50/30 p-12 text-center">
        <AlertCircle size={48} className="text-red-500" />
        <h2 className="text-xl font-black tracking-tighter text-slate-950 uppercase italic">
          Erro de Sincronização
        </h2>
        <p className="text-sm font-medium text-slate-500">{error}</p>
        <button
          onClick={fetchProducts}
          className="flex items-center gap-2 rounded-xl bg-slate-950 px-8 py-3 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-600"
        >
          <RefreshCw size={14} /> Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div
      ref={listTopRef}
      className="animate-in fade-in duration-500 scroll-mt-32"
    >
      <section className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Filtrar por nome ou SKU..."
            className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 pl-12 pr-4 text-xs font-bold text-slate-950 outline-none transition-all focus:border-indigo-600 focus:bg-white"
          />
        </div>
        <button className="flex items-center gap-2 rounded-xl border-2 border-slate-100 bg-white px-5 py-3.5 text-[10px] font-black tracking-widest text-slate-500 uppercase hover:border-indigo-600 hover:text-indigo-600 transition-all">
          <Filter size={16} /> Parâmetros
        </button>
      </section>

      <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">
                <th className="py-5 pl-10">Ativo / SKU</th>
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
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-50">
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
                        product.stock === 0 ? "text-red-500" : "text-slate-950"
                      }`}
                    >
                      {product.stock} UN
                    </p>
                  </td>
                  <td className="py-6 font-black text-slate-950 italic">
                    R$ {product.price.toFixed(2)}
                  </td>
                  <td className="py-6 pr-10 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-100 bg-white text-slate-400 hover:text-indigo-600">
                        <Edit3 size={18} />
                      </button>
                      <button className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-100 bg-white text-slate-400 hover:text-red-500">
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
                    Nenhum registro localizado.
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
            className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-600 disabled:opacity-20"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`h-12 w-12 rounded-xl text-[11px] font-black ${
                  currentPage === i
                    ? "bg-slate-950 text-white shadow-2xl scale-110"
                    : "bg-white border-2 border-slate-200 text-slate-400"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-200 bg-white text-slate-600 disabled:opacity-20"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
