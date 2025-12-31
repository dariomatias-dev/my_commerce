"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { ApiError } from "@/@types/api";
import { CategoryResponse } from "@/@types/category/category-response";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { DeleteConfirmationDialog } from "@/components/dialogs/delete-confirmation-dialog";
import { useCategory } from "@/services/hooks/use-category";
import { CategoryFormDialog } from "../category-form-dialog";
import { DashboardCategoryCard } from "./dashboard-category-card";
import { DashboardCategoryManagerError } from "./dashboard-category-manager-error";
import { DashboardCategoryManagerLoading } from "./dashboard-category-manager-loading";
import { DashboardCategoryPagination } from "./dashboard-category-pagination";
import { DashboardCategorySearchBar } from "./dashboard-category-search-bar";

export interface DashboardCategoryManagerRef {
  refresh: () => void;
}

interface DashboardCategoryManagerProps {
  storeId: string;
}

export const DashboardCategoryManager = forwardRef<
  DashboardCategoryManagerRef,
  DashboardCategoryManagerProps
>(({ storeId }, ref) => {
  const { getCategoriesByStoreId, deleteCategory } = useCategory();
  const listTopRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFirstConfirmOpen, setIsFirstConfirmOpen] = useState(false);
  const [isSecondConfirmOpen, setIsSecondConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryResponse | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12;

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCategoriesByStoreId(storeId, currentPage, pageSize);
      setCategories(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError(
        error instanceof ApiError
          ? error.message
          : "Erro ao carregar as taxonomias da loja."
      );
    } finally {
      setIsLoading(false);
    }
  }, [storeId, currentPage, getCategoriesByStoreId]);

  useImperativeHandle(ref, () => ({
    refresh: fetchCategories,
  }));

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleEdit = (category: CategoryResponse) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (category: CategoryResponse) => {
    setSelectedCategory(category);
    setIsFirstConfirmOpen(true);
  };

  const handleProceedToFinalDelete = () => {
    setIsFirstConfirmOpen(false);
    setIsSecondConfirmOpen(true);
  };

  const handleCloseDialogs = () => {
    if (isDeleting) return;
    setIsFirstConfirmOpen(false);
    setIsSecondConfirmOpen(false);
    setSelectedCategory(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;
    try {
      setIsDeleting(true);
      await deleteCategory(selectedCategory.id);
      await fetchCategories();
      setIsSecondConfirmOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      alert(
        error instanceof ApiError ? error.message : "Erro ao excluir categoria."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) return <DashboardCategoryManagerLoading />;

  if (error) {
    return (
      <DashboardCategoryManagerError error={error} onRetry={fetchCategories} />
    );
  }

  return (
    <div
      ref={listTopRef}
      className="animate-in fade-in duration-500 scroll-mt-32"
    >
      <DashboardCategorySearchBar />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <DashboardCategoryCard
            key={category.id}
            category={category}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        ))}

        {categories.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">
              Nenhuma categoria vinculada a esta unidade.
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <DashboardCategoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <CategoryFormDialog
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCategory(null);
        }}
        storeId={storeId}
        initialData={selectedCategory}
        onSuccess={fetchCategories}
      />

      <ConfirmDialog
        isOpen={isFirstConfirmOpen}
        onClose={handleCloseDialogs}
        onConfirm={handleProceedToFinalDelete}
        title="Remover Categoria?"
        description={`Você está prestes a iniciar a exclusão da categoria "${selectedCategory?.name}".`}
        confirmText="Sim, prosseguir"
        variant="danger"
      />

      <DeleteConfirmationDialog
        isOpen={isSecondConfirmOpen}
        onClose={handleCloseDialogs}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Confirmar Remoção"
        description="Esta ação excluirá permanentemente a categoria. Produtos vinculados poderão ficar sem categoria."
        confirmationName={selectedCategory?.name || ""}
      />
    </div>
  );
});

DashboardCategoryManager.displayName = "DashboardCategoryManager";
