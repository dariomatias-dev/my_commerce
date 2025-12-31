import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ApiError } from "@/@types/api";
import { CategoryResponse } from "@/@types/category/category-response";
import { ProductResponse } from "@/@types/product/product-response";
import { useCategory } from "@/services/hooks/use-category";
import { useProduct } from "@/services/hooks/use-product";
import { ProductCard } from "./product-card";
import { StoreCategoryTabs } from "./store-category-tabs";

interface StoreCatalogSectionProps {
  storeId: string;
  searchQuery: string;
}

export const StoreCatalogSection = ({
  storeId,
  searchQuery,
}: StoreCatalogSectionProps) => {
  const { getProductsByStoreId } = useProduct();
  const { getCategoriesByStoreId } = useCategory();

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const productsPerPage = 8;

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategoriesByStoreId(storeId, 0, 100);
      setCategories(res.content);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }
  }, [storeId, getCategoriesByStoreId]);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await getProductsByStoreId(
        storeId,
        {
          categoryId: activeCategoryId === "all" ? undefined : activeCategoryId,
        },
        currentPage,
        productsPerPage
      );

      setProducts(res.content);
      setTotalPages(res.totalPages);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível carregar o catálogo de produtos.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [storeId, activeCategoryId, currentPage, getProductsByStoreId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCurrentPage(0);
  }, [activeCategoryId, searchQuery]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;

    return products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  return (
    <section className="py-24" id="catalog">
      <div className="mb-20">
        <h2 className="text-6xl font-black tracking-tighter text-slate-950 uppercase italic mb-10">
          CATÁLOGO <span className="text-indigo-600">GERAL.</span>
        </h2>

        <StoreCategoryTabs
          categories={categories}
          activeCategoryId={activeCategoryId}
          onCategoryChange={setActiveCategoryId}
        />
      </div>

      {error && (
        <div className="mb-12 flex flex-col items-center justify-center gap-6 rounded-[3rem] border-2 border-dashed border-red-100 bg-red-50/30 p-16 text-center">
          <AlertCircle size={48} className="text-red-500" />
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tighter text-slate-950 uppercase italic">
              Falha na Sincronização
            </h3>
            <p className="text-sm font-medium text-slate-500 italic uppercase tracking-wider">
              {error}
            </p>
          </div>
          <button
            onClick={fetchProducts}
            className="rounded-xl bg-slate-950 px-8 py-4 text-[10px] font-black tracking-[0.2em] text-white uppercase transition-all hover:bg-indigo-600 active:scale-95"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <p className="text-[10px] font-black tracking-[0.5em] text-slate-400 uppercase italic">
            Processando Requisição...
          </p>
        </div>
      ) : filteredProducts.length === 0 && !error ? (
        <div className="py-40 text-center animate-in fade-in zoom-in duration-500">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-slate-200">
            <Search size={40} />
          </div>
          <h3 className="mt-8 text-2xl font-black uppercase italic text-slate-300">
            Nenhum registro localizado
          </h3>
        </div>
      ) : (
        !error && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-24 flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="h-14 w-14 flex items-center justify-center rounded-2xl border-2 border-slate-100 transition-all hover:border-indigo-600 disabled:opacity-30 disabled:hover:border-slate-100"
                >
                  <ChevronLeft size={24} />
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`h-14 w-14 rounded-2xl text-sm font-black transition-all ${
                        currentPage === i
                          ? "bg-slate-950 text-white scale-110 shadow-xl"
                          : "border-2 border-slate-100 text-slate-400 hover:border-indigo-600"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={currentPage === totalPages - 1}
                  className="h-14 w-14 flex items-center justify-center rounded-2xl border-2 border-slate-100 transition-all hover:border-indigo-600 disabled:opacity-30 disabled:hover:border-slate-100"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        )
      )}
    </section>
  );
};
