"use client";

import { ArrowLeft, Package, Plus, Tag } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { StoreResponse } from "@/@types/store/store-response";
import { CategoryFormDialog } from "@/components/dashboard/store/[slug]/products/category-form-dialog";
import {
  CategoryManager,
  CategoryManagerRef,
} from "@/components/dashboard/store/[slug]/products/category-manager";
import { ProductManager } from "@/components/dashboard/store/[slug]/products/product-manager";
import { useStore } from "@/services/hooks/use-store";

export default function StoreInventoryPage() {
  const { slug } = useParams() as { slug: string };
  const { getStoreBySlug } = useStore();

  const router = useRouter();

  const [view, setView] = useState<"products" | "categories">("products");
  const [store, setStore] = useState<StoreResponse | null>(null);

  const [isCategoryFormDialogOpen, setIsCategoryFormDialogOpen] =
    useState(false);

  const categoryManagerRef = useRef<CategoryManagerRef>(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const data = await getStoreBySlug(slug);
        setStore(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStore();
  }, [getStoreBySlug, slug]);

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
                {store?.name || slug}
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
                    : "text-slate-500"
                }`}
              >
                <Package size={14} /> Produtos
              </button>
              <button
                onClick={() => setView("categories")}
                className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all rounded-lg ${
                  view === "categories"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                <Tag size={14} /> Categorias
              </button>
            </div>

            <button
              onClick={handleCreateClick}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-4 text-[10px] font-black tracking-widest text-white shadow-2xl hover:bg-indigo-600 transition-all border-2 border-transparent focus:border-indigo-400 outline-none"
            >
              <Plus size={16} />{" "}
              {view === "products" ? "NOVO PRODUTO" : "NOVA CATEGORIA"}
            </button>
          </div>
        </div>

        {view === "products" && store && <ProductManager storeId={store.id} />}

        {view === "categories" && store && (
          <CategoryManager storeId={store.id} ref={categoryManagerRef} />
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
}
