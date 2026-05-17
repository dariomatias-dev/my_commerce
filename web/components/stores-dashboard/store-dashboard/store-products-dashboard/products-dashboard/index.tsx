"use client";

import { useEffect, useRef, useState } from "react";

import { ApiError } from "@/@types/api";
import { ProductFilters } from "@/@types/product/product-filters";
import { ProductResponse } from "@/@types/product/product-response";
import { deleteProduct } from "@/app/actions/products";
import { LoadingIndicator } from "@/components/loading-indicator";
import { Pagination } from "@/components/pagination";
import { StatusFilter } from "@/enums/status-filter";
import { getAllProducts } from "@/services/products";

import { ProductsDashboardError } from "./products-dashboard-error";
import { ProductsDashboardFilter } from "./products-dashboard-filter";
import { ProductsDashboardTable } from "./products-dashboard-table";

interface ProductsDashboardProps {
  storeId: string;
  basePath: string;
}

export const ProductsDashboard = ({ storeId, basePath }: ProductsDashboardProps) => {
  const listTopRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const [appliedFilters, setAppliedFilters] = useState<Omit<ProductFilters, "storeId">>({
    status: StatusFilter.ALL,
    minPrice: undefined,
    maxPrice: undefined,
    lowStockThreshold: undefined,
    categoryId: undefined,
    name: undefined,
  });

  useEffect(() => {
    let ignore = false;

    async function fetchProducts() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getAllProducts({ storeId, ...appliedFilters }, currentPage, 10);

        if (!ignore) {
          setProducts(data.content || []);
          setTotalPages(data.totalPages || 0);
        }
      } catch (error) {
        if (!ignore) {
          if (error instanceof ApiError) {
            setError(error.message);
          } else {
            setError("Erro ao carregar produtos.");
          }
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchProducts();

    return () => {
      ignore = true;
    };
  }, [storeId, currentPage, appliedFilters, refreshKey]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleApplyFilters = (newFilters: Omit<ProductFilters, "storeId">) => {
    setAppliedFilters(newFilters);
    setCurrentPage(0);
  };

  const onDelete = async (productId: string) => {
    const result = await deleteProduct(productId);

    if (!result.success) {
      setError(result.error);

      return;
    }

    setRefreshKey((k) => k + 1);
  };

  if (error) {
    return <ProductsDashboardError message={error} onRetry={() => setRefreshKey((k) => k + 1)} />;
  }

  return (
    <div ref={listTopRef} className="animate-in fade-in scroll-mt-32 duration-500">
      <ProductsDashboardFilter onApply={handleApplyFilters} currentFilters={appliedFilters} />

      {isLoading ? (
        <LoadingIndicator message="Sincronizando inventário..." className="min-h-64" />
      ) : (
        <>
          <ProductsDashboardTable products={products} basePath={basePath} onDelete={onDelete} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};
