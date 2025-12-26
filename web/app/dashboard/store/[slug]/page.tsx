"use client";

import {
  Activity,
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Cpu,
  Download,
  Eye,
  Loader2,
  Plus,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { StoreResponse } from "@/@types/store/store-response";
import { TransactionResponse } from "@/@types/transaction/transaction-response";
import { DashboardSidebarActions } from "@/components/dashboard/store/[slug]/dashboard-sidebar-actions";
import { DashboardStatCard } from "@/components/dashboard/store/[slug]/dashboard-stat-card";
import { DashboardTransactionTable } from "@/components/dashboard/store/[slug]/dashboard-transaction-table";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Footer } from "@/components/layout/footer";
import { PaymentMethod } from "@/enums/payment-method";
import { useStore } from "@/services/hooks/use-store";
import { useTransaction } from "@/services/hooks/use-transaction";

const StoreDashboardPage = () => {
  const params = useParams();
  const slug = params.slug as string;
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
    } catch (error) {
      if (error instanceof ApiError) setError(error.message);
      else setError("Não foi possível carregar os dados desta instância.");
    } finally {
      setIsLoading(false);
    }
  }, [slug, getStoreBySlug, fetchTransactions]);

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      [PaymentMethod.CREDIT_CARD]: "Cartão de Crédito",
      [PaymentMethod.DEBIT_CARD]: "Cartão de Débito",
      [PaymentMethod.PIX]: "Pix",
      [PaymentMethod.BOLETO]: "Boleto",
      [PaymentMethod.CASH]: "Dinheiro",
    };
    return labels[method] || method;
  };

  if (isLoading) {
    return (
      <>
        <DashboardHeader />
        <main className="min-h-screen bg-[#F4F7FA] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="text-[10px] font-black tracking-[0.5em] text-slate-400 uppercase">
              Carregando Engine...
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !store) {
    return (
      <>
        <DashboardHeader />
        <main className="min-h-screen bg-[#F4F7FA] mx-auto max-w-400 px-6 pt-40 pb-20">
          <div className="flex flex-col items-center justify-center gap-6 rounded-[3rem] border border-red-100 bg-red-50/30 p-16 text-center">
            <AlertCircle size={64} className="text-red-500" />
            <div className="max-w-xl space-y-4">
              <h2 className="text-4xl font-black tracking-tighter text-slate-950 uppercase italic">
                Instância Não Localizada.
              </h2>
              <p className="text-lg font-medium text-slate-500 italic">
                {error ||
                  "A loja solicitada não responde aos protocolos de rede."}
              </p>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-2xl bg-slate-950 px-10 py-5 text-xs font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-600"
            >
              <ArrowLeft size={18} /> VOLTAR AO PAINEL GLOBAL
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F7FA] font-sans text-slate-900 mx-auto max-w-400 px-6 pt-32 pb-12">
      <div className="animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end">
          <div>
            <Link
              href="/dashboard"
              className="mb-6 flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-indigo-600"
            >
              <ArrowLeft size={14} /> Voltar para instâncias
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
            <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic leading-none">
              CONSOLE: <span className="text-indigo-600">{store.name}.</span>
            </h1>
          </div>

          <div className="flex w-full flex-wrap gap-3 lg:w-auto">
            <button className="flex flex-1 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4 text-[10px] font-black tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-50 lg:flex-none">
              <Download size={14} /> EXPORTAR
            </button>
            <Link
              href={`${slug}/products`}
              className="flex flex-1 items-center justify-center gap-3 rounded-xl border border-slate-950 bg-white px-6 py-4 text-[10px] font-black tracking-widest text-slate-950 uppercase transition-all hover:bg-slate-50 lg:flex-none"
            >
              <Eye size={16} /> VER PRODUTOS
            </Link>
            <Link
              href={`${slug}/products/new`}
              className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-slate-950 px-6 py-4 text-[10px] font-black tracking-widest text-white shadow-2xl transition-all hover:bg-indigo-600 active:scale-95 lg:flex-none"
            >
              <Plus size={16} /> CRIAR PRODUTO
            </Link>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardStatCard
            label="Fluxo de Vendas"
            value="R$ 0,00"
            sub="Volume acumulado 24h"
            icon={Activity}
            isActive={store.isActive}
          />
          <DashboardStatCard
            label="Disponibilidade"
            value="99.99%"
            sub="SLA de serviço estável"
            icon={ShieldCheck}
            isActive={store.isActive}
          />
          <DashboardStatCard
            label="Taxa de Requisições"
            value="1.240 req/s"
            sub="Pico de processamento"
            icon={Cpu}
            isActive={store.isActive}
          />
          <DashboardStatCard
            label="Conversão Global"
            value="0.00%"
            sub="Métrica em sincronização"
            icon={BarChart3}
            isActive={store.isActive}
          />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <DashboardTransactionTable
            transactions={transactions}
            isLoading={isTransactionsLoading}
            onRefresh={fetchTransactions}
            getPaymentMethodLabel={getPaymentMethodLabel}
          />

          <DashboardSidebarActions />
        </div>
      </div>
    </main>
  );
};

export default StoreDashboardPage;
