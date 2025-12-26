"use client";

import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Loader2,
  RefreshCw,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
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
import { useCategory } from "@/services/hooks/use-category";
import { CategoryFormDialog } from "./category-form-dialog";

export interface CategoryManagerRef {
  refresh: () => void;
}

interface CategoryManagerProps {
  storeId: string;
}

export const CategoryManager = forwardRef<
  CategoryManagerRef,
  CategoryManagerProps
>(({ storeId }, ref) => {
  const { getCategoriesByStoreId, deleteCategory } = useCategory();
  const listTopRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
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
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Erro ao carregar as taxonomias da loja.");
      }
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
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;
    try {
      setIsDeleting(true);

      await deleteCategory(selectedCategory.id);
      await fetchCategories();

      setIsConfirmOpen(false);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
        alert(error.message);
      } else {
        alert("Erro ao excluir categoria.");
      }
    } finally {
      setIsDeleting(false);
      setSelectedCategory(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
          Mapeando Estrutura...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center gap-6 rounded-[3rem] border border-red-100 bg-red-50/30 p-12 text-center">
        <AlertCircle size={48} className="text-red-500" />
        <div className="max-w-md space-y-2">
          <h2 className="text-xl font-black tracking-tighter text-slate-950 uppercase italic">
            Falha na Requisição
          </h2>
          <p className="text-sm font-medium text-slate-500">{error}</p>
        </div>
        <button
          onClick={fetchCategories}
          className="flex items-center gap-2 rounded-xl bg-slate-950 px-8 py-3 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-600"
        >
          <RefreshCw size={14} /> Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div
      ref={listTopRef}
      className="animate-in fade-in duration-500 scroll-mt-32"
    >
      <section className="mb-8 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Filtrar categorias por nome..."
            className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 pl-12 pr-4 text-xs font-bold text-slate-950 outline-none transition-all focus:border-indigo-600 focus:bg-white"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="group relative rounded-[2.5rem] border-2 border-slate-200 bg-white p-8 transition-all hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-500/5"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Tag size={24} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                Produto
              </span>
            </div>

            <h3 className="text-2xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
              {category.name}
            </h3>

            <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Criado em:{" "}
              {new Date(category.createdAt).toLocaleDateString("pt-BR")}
            </p>

            <div className="mt-8 flex gap-2 border-t border-slate-50 pt-6">
              <button
                onClick={() => handleEdit(category)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-100 py-2.5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-indigo-600 hover:text-indigo-600 transition-all"
              >
                <Edit3 size={14} /> Editar
              </button>
              <button
                onClick={() => handleDeleteClick(category)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-500 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
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
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-20 shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`h-12 w-12 rounded-xl text-[11px] font-black transition-all ${
                  currentPage === i
                    ? "bg-slate-950 text-white shadow-2xl scale-110"
                    : "bg-white border-2 border-slate-200 text-slate-400 hover:border-indigo-600"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-20 shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
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
        isOpen={isConfirmOpen}
        isLoading={isDeleting}
        onClose={() => {
          setIsConfirmOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Remover Categoria?"
        description={`Você está prestes a excluir a categoria "${selectedCategory?.name}". Esta ação não poderá ser desfeita.`}
        confirmText="EXCLUIR PERMANENTEMENTE"
        variant="danger"
      />
    </div>
  );
});

CategoryManager.displayName = "CategoryManager";
