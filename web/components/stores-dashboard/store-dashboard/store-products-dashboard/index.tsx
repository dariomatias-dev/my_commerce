"use client";

import { ArrowLeft, Package, Plus, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { StoreResponse } from "@/@types/store/store-response";
import { CategoryFormDialog } from "@/components/stores-dashboard/store-dashboard/store-products-dashboard/category-form-dialog";
import {
  DashboardCategoryManager,
  DashboardCategoryManagerRef,
} from "@/components/stores-dashboard/store-dashboard/store-products-dashboard/dashboard-category-manager";
import { ProductManager } from "@/components/stores-dashboard/store-dashboard/store-products-dashboard/product-manager";
import { useStore } from "@/services/hooks/use-store";

interface StoreProductsDashboardProps {
  storeSlug: string;
  backPath: string;
  canCreate?: boolean;
}

export const StoreProductsDashboard = ({
  storeSlug,
  backPath,
  canCreate = true,
}: StoreProductsDashboardProps) => {
  const router = useRouter();
  const { getStoreBySlug } = useStore();

  const [view, setView] = useState<"products" | "categories">("products");
  const [store, setStore] = useState<StoreResponse | null>(null);
  const [isCategoryFormDialogOpen, setIsCategoryFormDialogOpen] =
    useState(false);

  const categoryManagerRef = useRef<DashboardCategoryManagerRef>(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await getStoreBySlug(storeSlug);
        setStore(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStore();
  }, [storeSlug, getStoreBySlug]);

  const handleRefresh = () => {
    categoryManagerRef.current?.refresh();
  };

  const handleCreateClick = () => {
    if (view === "products") {
      router.push("products/new");
    } else {
      setIsCategoryFormDialogOpen(true);
    }
  };

  return (
    <main className="mx-auto max-w-400 px-6 pt-32 pb-12 font-sans text-slate-900 min-h-screen bg-[#F4F7FA]">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end">
          <div>
            <Link
              href={backPath}
              className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft size={14} /> Voltar ao Console
            </Link>

            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-5 items-center rounded bg-indigo-600 px-2 text-[9px] font-black tracking-widest text-white uppercase">
                Gestão de Ativos
              </div>

              <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase italic">
                {store?.name || storeSlug}
              </span>
            </div>

            <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic md:text-6xl">
              INVENTÁRIO <span className="text-indigo-600">CENTRAL.</span>
            </h1>
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto h-14">
            <div className="flex h-full rounded-xl bg-slate-200/50 p-1">
              <button
                onClick={() => setView("products")}
                className={`flex h-full items-center gap-2 px-6 text-[10px] font-black tracking-widest uppercase transition-all rounded-lg ${
                  view === "products"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                <Package size={14} /> Produtos
              </button>

              <button
                onClick={() => setView("categories")}
                className={`flex h-full items-center gap-2 px-6 text-[10px] font-black tracking-widest uppercase transition-all rounded-lg ${
                  view === "categories"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                <Tag size={14} /> Categorias
              </button>
            </div>

            {canCreate && (
              <button
                onClick={handleCreateClick}
                className="flex h-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-8 text-[10px] font-black tracking-widest text-white shadow-2xl hover:bg-indigo-600 transition-all border-2 border-transparent focus:border-indigo-400 outline-none"
              >
                <Plus size={16} />{" "}
                {view === "products" ? "NOVO PRODUTO" : "NOVA CATEGORIA"}
              </button>
            )}
          </div>
        </div>

        {view === "products" && store && <ProductManager storeId={store.id} />}

        {view === "categories" && store && (
          <DashboardCategoryManager
            storeId={store.id}
            ref={categoryManagerRef}
          />
        )}
      </div>

      {store && (
        <CategoryFormDialog
          isOpen={isCategoryFormDialogOpen}
          onClose={() => setIsCategoryFormDialogOpen(false)}
          storeId={store.id}
          onSuccess={handleRefresh}
        />
      )}
    </main>
  );
};
