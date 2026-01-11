"use client";

import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { KeyboardEvent, useState } from "react";

import { ProductFilters } from "@/@types/product/product-filters";

interface ProductsDashboardFilterProps {
  currentFilters: Omit<ProductFilters, "storeId">;
  onApply: (filters: Omit<ProductFilters, "storeId">) => void;
}

export const ProductsDashboardFilter = ({
  currentFilters,
  onApply,
}: ProductsDashboardFilterProps) => {
  const [localFilters, setLocalFilters] =
    useState<Omit<ProductFilters, "storeId">>(currentFilters);

  const triggerApply = (updated: Omit<ProductFilters, "storeId">) => {
    onApply({
      ...updated,
      name: updated.name || undefined,
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      triggerApply(localFilters);
    }
  };

  const handleStatusToggle = (target: "ACTIVE" | "DELETED") => {
    const newStatus: ProductFilters["status"] =
      localFilters.status === target ? "ALL" : target;
    const updated = { ...localFilters, status: newStatus };
    setLocalFilters(updated);
    triggerApply(updated);
  };

  const handleLowStockToggle = () => {
    const newValue = localFilters.lowStockThreshold ? undefined : 5;
    const updated = { ...localFilters, lowStockThreshold: newValue };
    setLocalFilters(updated);
    triggerApply(updated);
  };

  const clearField = (field: keyof Omit<ProductFilters, "storeId">) => {
    const updated = { ...localFilters, [field]: undefined };
    if (field === "name") updated.name = "";
    setLocalFilters(updated);
    triggerApply(updated);
  };

  const blockInvalidChars = (e: KeyboardEvent) => {
    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
  };

  return (
    <section className="mb-10 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1 group">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600"
            size={20}
          />
          <input
            type="text"
            value={localFilters.name || ""}
            onChange={(e) =>
              setLocalFilters((prev) => ({ ...prev, name: e.target.value }))
            }
            onKeyDown={handleKeyDown}
            placeholder="PESQUISAR E PRESSIONAR ENTER PARA APLICAR..."
            className="w-full rounded-[2rem] border border-slate-100 bg-white px-14 py-5 text-[11px] font-black tracking-widest text-slate-950 outline-none transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 placeholder:text-slate-400 shadow-sm"
          />
          {localFilters.name && (
            <button
              onClick={() => clearField("name")}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 transition-all"
            >
              <XCircle size={20} />
            </button>
          )}
        </div>

        <div className="flex h-15.5 rounded-2xl bg-slate-200/50 p-1.5">
          <button
            onClick={() => handleStatusToggle("ACTIVE")}
            className={`flex items-center gap-2 px-6 rounded-xl text-[10px] font-black tracking-[0.15em] uppercase transition-all ${
              localFilters.status === "ACTIVE"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <CheckCircle2 size={14} /> Ativos
          </button>

          <button
            onClick={() => handleStatusToggle("DELETED")}
            className={`flex items-center gap-2 px-6 rounded-xl text-[10px] font-black tracking-[0.15em] uppercase transition-all ${
              localFilters.status === "DELETED"
                ? "bg-white text-red-500 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <XCircle size={14} /> Inativos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <button
          onClick={handleLowStockToggle}
          className={`flex items-center justify-between rounded-[2rem] border-2 px-8 py-5 transition-all ${
            localFilters.lowStockThreshold
              ? "border-amber-500 bg-amber-50/50 text-amber-700"
              : "border-slate-100 bg-white text-slate-400 hover:border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-2 rounded-xl ${
                localFilters.lowStockThreshold
                  ? "bg-amber-500 text-white"
                  : "bg-slate-50 text-slate-300"
              }`}
            >
              <AlertTriangle size={18} />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-[10px] font-black uppercase tracking-widest">
                Estoque
              </span>
              <span className="text-[9px] font-bold opacity-60 uppercase italic">
                Nível Crítico
              </span>
            </div>
          </div>
          {localFilters.lowStockThreshold && (
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </button>

        <div className="group relative flex items-center gap-4 rounded-[2rem] border border-slate-100 bg-white px-8 py-4 shadow-sm focus-within:border-indigo-600 transition-all">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-300">
            <DollarSign size={18} />
          </div>
          <div className="flex flex-1 flex-col">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Preço Mínimo
            </label>
            <input
              type="number"
              value={localFilters.minPrice ?? ""}
              onKeyDown={(e) => {
                blockInvalidChars(e);
                handleKeyDown(e);
              }}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  minPrice: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              placeholder="0.00"
              className="w-full bg-transparent text-sm font-black text-slate-950 outline-none placeholder:text-slate-200"
            />
          </div>
          {localFilters.minPrice !== undefined && (
            <button
              onClick={() => clearField("minPrice")}
              className="text-slate-300 hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="group relative flex items-center gap-4 rounded-[2rem] border border-slate-100 bg-white px-8 py-4 shadow-sm focus-within:border-indigo-600 transition-all">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-300">
            <DollarSign size={18} />
          </div>
          <div className="flex flex-1 flex-col">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Preço Máximo
            </label>
            <input
              type="number"
              value={localFilters.maxPrice ?? ""}
              onKeyDown={(e) => {
                blockInvalidChars(e);
                handleKeyDown(e);
              }}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  maxPrice: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              placeholder="10000.00"
              className="w-full bg-transparent text-sm font-black text-slate-950 outline-none placeholder:text-slate-200"
            />
          </div>
          {localFilters.maxPrice !== undefined && (
            <button
              onClick={() => clearField("maxPrice")}
              className="text-slate-300 hover:text-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
