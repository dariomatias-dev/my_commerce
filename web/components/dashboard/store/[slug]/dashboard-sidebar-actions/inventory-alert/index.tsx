"use client";

import { AlertTriangle, ArrowRight, Package } from "lucide-react";
import { useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { PaginatedResponse } from "@/@types/paginated-response";
import { ProductResponse } from "@/@types/product/product-response";
import { useProduct } from "@/services/hooks/use-product";
import { InventoryItem } from "./inventory-alert-item";

interface InventoryAlertProps {
  storeId: string;
  threshold?: number;
  pageSize?: number;
}

export const InventoryAlert = ({
  storeId,
  threshold = 10,
  pageSize = 4,
}: InventoryAlertProps) => {
  const [lowStockCount, setLowStockCount] = useState<number | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<ProductResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getAllProducts } = useProduct();

  useEffect(() => {
    const fetchLowStock = async () => {
      setLoading(true);
      setError(null);

      try {
        const response: PaginatedResponse<ProductResponse> =
          await getAllProducts(
            { storeId, lowStockThreshold: threshold },
            0,
            pageSize
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
  }, [storeId, threshold, pageSize, getAllProducts]);

  return (
    <div className="rounded-[2.5rem] bg-slate-950 p-8 text-white shadow-2xl border border-slate-900">
      <div className="mb-9 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-black tracking-tighter uppercase italic text-indigo-400">
            Monitor de Estoque
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                lowStockProducts.length > 0
                  ? "bg-orange-500 animate-pulse"
                  : "bg-emerald-500"
              }`}
            />
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              {lowStockProducts.length > 0
                ? "Ação Necessária"
                : "Status Nominal"}
            </p>
          </div>
        </div>
        <div
          className={`p-3 rounded-2xl ${
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
            <div className="h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-[9px] font-black tracking-widest text-slate-600 uppercase">
              Acessando produtos...
            </p>
          </div>
        ) : error ? (
          <div className="flex h-36 items-center justify-center text-center">
            <p className="text-[10px] font-black text-red-500 uppercase italic tracking-widest">
              {error}
            </p>
          </div>
        ) : lowStockProducts.length > 0 ? (
          <ul className="space-y-3">
            {lowStockProducts.map((product) => (
              <InventoryItem
                key={product.id}
                product={product}
                threshold={threshold}
              />
            ))}
            {lowStockCount && lowStockCount > pageSize && (
              <p className="pt-3 text-center text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">
                + {lowStockCount - pageSize} Produto(s) em Estado Crítico(s)
              </p>
            )}
          </ul>
        ) : (
          <div className="flex h-36 flex-col items-center justify-center gap-4 border-2 border-dashed border-slate-900 rounded-[2rem]">
            <div className="h-10 w-10 rounded-full bg-emerald-500/5 flex items-center justify-center text-emerald-500">
              <Package size={20} />
            </div>
            <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase italic text-center px-4">
              Integridade de Inventário Verificada
            </p>
          </div>
        )}
      </div>

      <button className="mt-9 flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-4.5 text-[10px] font-black tracking-widest text-slate-950 uppercase transition-all hover:bg-indigo-600 hover:text-white active:scale-95 shadow-xl h-14">
        REABASTECER AGORA <ArrowRight size={16} />
      </button>
    </div>
  );
};
