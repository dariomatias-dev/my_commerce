"use client";

import { Package, Plus, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { StoreResponse } from "@/@types/store/store-response";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import {
  CategoriesDashboard,
  CategoriesDashboardRef,
} from "@/components/stores-dashboard/store-dashboard/store-products-dashboard/categories-dashboard";
import { CategoryFormDialog } from "@/components/stores-dashboard/store-dashboard/store-products-dashboard/category-form-dialog";
import { ProductsDashboard } from "@/components/stores-dashboard/store-dashboard/store-products-dashboard/products-dashboard";
import { useStore } from "@/services/hooks/use-store";

interface StoreProductsDashboardProps {
  storeSlug: string;
  basePath: string;
  canCreate?: boolean;
}

export const StoreProductsDashboard = ({
  storeSlug,
  basePath,
  canCreate = true,
}: StoreProductsDashboardProps) => {
  const router = useRouter();

  const { getStoreBySlug } = useStore();

  const [view, setView] = useState<"products" | "categories">("products");
  const [store, setStore] = useState<StoreResponse | null>(null);
  const [isCategoryFormDialogOpen, setIsCategoryFormDialogOpen] =
    useState(false);

  const categoryManagerRef = useRef<CategoriesDashboardRef>(null);

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
    <>
      <DashboardPageHeader
        backPath={basePath}
        label={`Gestão de Ativos — ${store?.name || storeSlug}`}
        title="INVENTÁRIO CENTRAL"
        subtitle="Administração técnica de itens, volumes e departamentos comerciais."
        actions={
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
        }
      />

      {view === "products" && store && (
        <ProductsDashboard storeId={store.id} basePath={basePath} />
      )}

      {view === "categories" && store && (
        <CategoriesDashboard storeId={store.id} ref={categoryManagerRef} />
      )}

      {store && (
        <CategoryFormDialog
          isOpen={isCategoryFormDialogOpen}
          onClose={() => setIsCategoryFormDialogOpen(false)}
          storeId={store.id}
          onSuccess={handleRefresh}
        />
      )}
    </>
  );
};
