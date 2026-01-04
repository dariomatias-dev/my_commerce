"use client";

import {
  AlertCircle,
  ArrowLeft,
  Download,
  Eye,
  Plus,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { StoreResponse } from "@/@types/store/store-response";
import { TransactionResponse } from "@/@types/transaction/transaction-response";
import { DashboardSidebarActions } from "@/components/dashboard/store/[slug]/dashboard-sidebar-actions";
import { DashboardStats } from "@/components/dashboard/store/[slug]/dashboard-stats";
import { DashboardTransactionTable } from "@/components/dashboard/store/[slug]/dashboard-transaction-table";
import { LoadingIndicator } from "@/components/loading-indicator";
import { useStore } from "@/services/hooks/use-store";
import { useTransaction } from "@/services/hooks/use-transaction";

interface StoreManagementProps {
  slug: string;
  backPath: string;
  backLabel: string;
  productsPath: string;
  createProductPath: string;
}

export const StoreManagement = ({
  slug,
  backPath,
  backLabel,
  productsPath,
  createProductPath,
}: StoreManagementProps) => {
  const { getStoreBySlug } = useStore();
  const { getTransactionsByStoreSlug } = useTransaction();

  const [store, setStore] = useState<StoreResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setIsTransactionsLoading(true);
      const response = await getTransactionsByStoreSlug(slug, 0, 10);
      setTransactions(response.content);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTransactionsLoading(false);
    }
  }, [slug, getTransactionsByStoreSlug]);

  const fetchStoreData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getStoreBySlug(slug);
      setStore(data);
      await fetchTransactions();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Erro ao carregar dados do console."
      );
    } finally {
      setIsLoading(false);
    }
  }, [slug, getStoreBySlug, fetchTransactions]);

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  if (isLoading)
    return <LoadingIndicator message="Sincronizando console operacional..." />;

  if (error || !store) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-red-50 text-red-500 shadow-xl shadow-red-100">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-950">
          Console <span className="text-red-500">Indisponível.</span>
        </h2>
        <p className="mt-4 max-w-xs text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {error || "Estabelecimento não localizado."}
        </p>
        <div className="mt-10 flex flex-col gap-4">
          <button
            onClick={fetchStoreData}
            className="flex items-center justify-center gap-3 rounded-2xl bg-slate-950 px-10 py-5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-600"
          >
            <RefreshCcw size={16} /> REESTABELECER CONEXÃO
          </button>
          <Link
            href={backPath}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950"
          >
            {backLabel}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F7FA] pb-12 pt-32 lg:px-6">
      <div className="mx-auto max-w-400 animate-in fade-in zoom-in-95 duration-500 px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end">
          <div>
            <Link
              href={backPath}
              className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-indigo-600"
            >
              <ArrowLeft size={14} /> {backLabel}
            </Link>

            <div className="mb-2 flex items-center gap-2">
              <div
                className={`flex h-5 items-center rounded px-2 text-[9px] font-black tracking-widest text-white uppercase ${
                  store.isActive ? "bg-indigo-600" : "bg-slate-400"
                }`}
              >
                {store.isActive ? "OPERACIONAL" : "OFFLINE"}
              </div>
              <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase italic">
                ID: {store.id.slice(0, 8).toUpperCase()}-SECURED
              </span>
            </div>

            <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic leading-none md:text-6xl">
              CONSOLE: <span className="text-indigo-600">{store.name}.</span>
            </h1>
          </div>

          <div className="flex w-full flex-wrap gap-3 lg:w-auto">
            <button className="flex flex-1 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4 text-[10px] font-black tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-50 lg:flex-none">
              <Download size={14} /> EXPORTAR
            </button>

            <Link
              href={productsPath}
              className="flex flex-1 items-center justify-center gap-3 rounded-xl border border-slate-950 bg-white px-6 py-4 text-[10px] font-black tracking-widest text-slate-950 uppercase transition-all hover:bg-slate-50 lg:flex-none"
            >
              <Eye size={16} /> PRODUTOS
            </Link>

            <Link
              href={createProductPath}
              className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-slate-950 px-6 py-4 text-[10px] font-black tracking-widest text-white shadow-2xl transition-all hover:bg-indigo-600 active:scale-95 lg:flex-none"
            >
              <Plus size={16} /> NOVO ITEM
            </Link>
          </div>
        </div>

        <DashboardStats isActive={store.isActive} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <DashboardTransactionTable
            transactions={transactions}
            isLoading={isTransactionsLoading}
            onRefresh={fetchTransactions}
          />
          <DashboardSidebarActions storeId={store.id} />
        </div>
      </div>
    </main>
  );
};
