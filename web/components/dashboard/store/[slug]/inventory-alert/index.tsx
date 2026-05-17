"use client";

import { useEffect, useState } from "react";

import { AlertTriangle, Loader2, Package } from "lucide-react";

import { ApiError } from "@/@types/api";
import { PaginatedResponse } from "@/@types/paginated-response";
import { ProductResponse } from "@/@types/product/product-response";
import { getAllProducts } from "@/services/products";

import { InventoryItem } from "./inventory-alert-item";

interface InventoryAlertProps {
  storeId: string;
  threshold?: number;
  pageSize?: number;
}

export const InventoryAlert = ({ storeId, threshold = 10, pageSize = 4 }: InventoryAlertProps) => {
  const [lowStockCount, setLowStockCount] = useState<number | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLowStock = async () => {
      setLoading(true);
      setError(null);

      try {
        const response: PaginatedResponse<ProductResponse> = await getAllProducts(
          { storeId, lowStockThreshold: threshold },
          0,
          pageSize,
        );

        setLowStockCount(response.totalElements);
        setLowStockProducts(response.content);
      } catch (err) {
        if (err instanceof ApiError) setError(err.message);
        else setError("Erro ao sincronizar estoque");
        setLowStockCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStock();
  }, [storeId, threshold, pageSize]);

  return (
    <aside className="lg:col-span-4">
      <div className="sticky top-40 rounded-[2.5rem] border border-slate-900 bg-slate-950 p-8 text-white shadow-2xl">
        <div className="mb-9 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-black tracking-tighter text-indigo-400 uppercase italic">
              Monitor de Estoque
            </h3>
            <div className="flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  lowStockProducts.length > 0 ? "animate-pulse bg-orange-500" : "bg-emerald-500"
                }`}
              />
              <p className="text-[9px] font-black tracking-widest text-slate-500 uppercase">
                {lowStockProducts.length > 0 ? "Ação Necessária" : "Status Nominal"}
              </p>
            </div>
          </div>
          <div
            className={`rounded-2xl p-3 ${
              lowStockProducts.length > 0
                ? "bg-orange-500/10 text-orange-500"
                : "bg-emerald-500/10 text-emerald-500"
            }`}
          >
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="min-h-45">
          {loading ? (
            <div className="flex h-36 flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-indigo-500" size={24} />
              <p className="text-[9px] font-black tracking-widest text-slate-600 uppercase">
                Acessando produtos...
              </p>
            </div>
          ) : error ? (
            <div className="flex h-36 items-center justify-center text-center">
              <p className="px-4 text-[10px] leading-relaxed font-black tracking-widest text-red-500 uppercase italic">
                {error}
              </p>
            </div>
          ) : lowStockProducts.length > 0 ? (
            <ul className="space-y-3">
              {lowStockProducts.map((product) => (
                <InventoryItem key={product.id} product={product} threshold={threshold} />
              ))}
              {lowStockCount && lowStockCount > pageSize && (
                <p className="pt-3 text-center text-[8px] font-black tracking-[0.2em] text-slate-600 uppercase">
                  + {lowStockCount - pageSize} Produto(s) em Estado Crítico(s)
                </p>
              )}
            </ul>
          ) : (
            <div className="flex h-36 flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed border-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/5 text-emerald-500">
                <Package size={20} />
              </div>
              <p className="px-4 text-center text-[10px] font-black tracking-widest text-slate-500 uppercase italic">
                Integridade de Inventário Verificada
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
