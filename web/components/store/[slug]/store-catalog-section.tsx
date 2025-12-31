import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    const loadData = async () => {
      const [productsData, categoriesData] = await Promise.all([
        getProductsByStoreId(storeId, 0, 100),
        getCategoriesByStoreId(storeId, 0, 100),
      ]);
      setProducts(productsData.content);
      setCategories(categoriesData.content);
    };
    loadData();
  }, [storeId, getProductsByStoreId, getCategoriesByStoreId]);

  useEffect(() => {
    const reset = () => {
      setCurrentPage(1);
    };

    reset();
  }, [activeCategoryId, searchQuery]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategoryId === "all" || p.categoryId === activeCategoryId;
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategoryId, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(start, start + productsPerPage);
  }, [filteredProducts, currentPage]);

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

      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-40 text-center">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-slate-50 text-slate-200">
            <Search size={40} />
          </div>
          <h3 className="mt-8 text-2xl font-black uppercase italic text-slate-300">
            Nenhum registro localizado
          </h3>
        </div>
      ) : (
        totalPages > 1 && (
          <div className="mt-24 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-14 w-14 flex items-center justify-center rounded-2xl border-2 border-slate-100 hover:border-indigo-600 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`h-14 w-14 rounded-2xl text-sm font-black transition-all ${
                      currentPage === num
                        ? "bg-slate-950 text-white shadow-xl scale-110"
                        : "border-2 border-slate-100 text-slate-400 hover:border-indigo-600"
                    }`}
                  >
                    {num}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-14 w-14 flex items-center justify-center rounded-2xl border-2 border-slate-100 hover:border-indigo-600 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )
      )}
    </section>
  );
};
