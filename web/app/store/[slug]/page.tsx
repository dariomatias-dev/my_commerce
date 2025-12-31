"use client";

import { ChevronLeft, ChevronRight, Flame, Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CategoryResponse } from "@/@types/category/category-response";
import { ProductResponse } from "@/@types/product/product-response";
import { StoreResponse } from "@/@types/store/store-response";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/store/[slug]/product-card";
import { StoreCategoryTabs } from "@/components/store/[slug]/store-category-tabs";
import { StoreHeader } from "@/components/store/[slug]/store-header";
import { StoreHero } from "@/components/store/[slug]/store-hero";
import { StoreSpotlightSection } from "@/components/store/[slug]/store-spotlight-section";
import { useCategory } from "@/services/hooks/use-category";
import { useProduct } from "@/services/hooks/use-product";
import { useStore } from "@/services/hooks/use-store";

const StorePage = () => {
  const { slug } = useParams() as { slug: string };
  const { getStoreBySlug } = useStore();
  const { getProductsByStoreId } = useProduct();
  const { getCategoriesByStoreId } = useCategory();

  const [store, setStore] = useState<StoreResponse | null>(null);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const storeData = await getStoreBySlug(slug);
      setStore(storeData);
      const [productsData, categoriesData] = await Promise.all([
        getProductsByStoreId(storeData.id, 0, 100),
        getCategoriesByStoreId(storeData.id, 0, 100),
      ]);
      setProducts(productsData.content);
      setCategories(categoriesData.content);
    } catch (error) {
      console.error("Erro ao carregar loja:", error);
    } finally {
      setIsLoading(false);
    }
  }, [slug, getStoreBySlug, getProductsByStoreId, getCategoriesByStoreId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  const bestSellers = useMemo(() => products.slice(0, 4), [products]);
  const lastUnits = useMemo(
    () => products.filter((p) => p.stock > 0 && p.stock <= 5).slice(0, 2),
    [products]
  );
  const newEntries = useMemo(() => products.slice(-2), [products]);
  const spotlightProduct = useMemo(() => products[0], [products]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategoryId, searchQuery]);

  if (isLoading || !store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white font-black uppercase italic tracking-tighter text-slate-950">
        Sincronizando Ambiente...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <StoreHeader
        store={store}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="mx-auto max-w-400 px-8">
        <StoreHero
          store={store}
          bannerUrl={`${process.env.NEXT_PUBLIC_API_URL}/files/stores/${store.slug}/banner.jpeg`}
        />

        <section className="py-24 border-b border-slate-100">
          <div className="mb-16">
            <div className="flex items-center gap-2 text-indigo-600 mb-4">
              <Flame size={20} fill="currentColor" />
              <span className="text-[10px] font-black tracking-[0.4em] uppercase">
                Destaques
              </span>
            </div>
            <h2 className="text-6xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
              MAIS <span className="text-indigo-600">VENDIDOS.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {spotlightProduct && (
          <StoreSpotlightSection product={spotlightProduct} />
        )}

        <section className="py-24 border-b border-slate-100">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="rounded-[3.5rem] border-2 border-orange-100 bg-orange-50/20 p-12">
              <h3 className="text-4xl font-black tracking-tighter text-orange-600 uppercase italic mb-12">
                ÚLTIMAS <span className="text-slate-950">UNIDADES.</span>
              </h3>
              <div className="grid gap-8 sm:grid-cols-2">
                {lastUnits.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
            <div className="rounded-[3.5rem] border-2 border-emerald-100 bg-emerald-50/20 p-12">
              <h3 className="text-4xl font-black tracking-tighter text-emerald-600 uppercase italic mb-12">
                NOVIDADES <span className="text-slate-950">RECENTES.</span>
              </h3>
              <div className="grid gap-8 sm:grid-cols-2">
                {newEntries.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>
        </section>

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
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="h-14 w-14 flex items-center justify-center rounded-2xl border-2 border-slate-100 hover:border-indigo-600 disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StorePage;
