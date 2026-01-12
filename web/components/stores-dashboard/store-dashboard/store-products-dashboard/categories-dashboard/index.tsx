"use client";

import {
  forwardRef,
  KeyboardEvent,
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
import { SearchFilter } from "@/components/filters/search-filter";
import { Pagination } from "@/components/pagination";
import { useCategory } from "@/services/hooks/use-category";
import { CategoryFormDialog } from "../category-form-dialog";
import { CategoriesDashboardCard } from "./categories-dashboard-card";
import { CategoriesDashboardError } from "./categories-dashboard-error";
import { CategoriesDashboardLoading } from "./categories-dashboard-loading";

export interface CategoriesDashboardRef {
  refresh: () => void;
}

interface CategoriesDashboardProps {
  storeId: string;
}

export const CategoriesDashboard = forwardRef<
  CategoriesDashboardRef,
  CategoriesDashboardProps
>(({ storeId }, ref) => {
  const { getAllCategories, deleteCategory } = useCategory();

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

  const [localSearch, setLocalSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 12;

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getAllCategories(
        { storeId, name: searchTerm },
        currentPage,
        pageSize
      );

      setCategories(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Erro ao carregar as taxonomias da loja.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [storeId, currentPage, searchTerm, getAllCategories]);

  useImperativeHandle(ref, () => ({
    refresh: fetchCategories,
  }));

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      setSearchTerm(localSearch);
      setCurrentPage(0);
    }
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    setSearchTerm("");
    setCurrentPage(0);
  };

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

  if (isLoading) return <CategoriesDashboardLoading />;

  if (error) {
    return <CategoriesDashboardError error={error} onRetry={fetchCategories} />;
  }

  return (
    <div
      ref={listTopRef}
      className="animate-in fade-in duration-500 scroll-mt-32"
    >
      <div className="mb-8">
        <SearchFilter
          value={localSearch}
          onChange={setLocalSearch}
          onKeyDown={handleKeyDown}
          onClear={handleClearSearch}
          placeholder="PESQUISAR CATEGORIA E PRESSIONAR ENTER..."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <CategoriesDashboardCard
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
        <Pagination
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

CategoriesDashboard.displayName = "CategoriesDashboard";
