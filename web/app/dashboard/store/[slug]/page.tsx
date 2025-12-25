"use client";

import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Box,
  CheckCircle,
  ChevronRight,
  Clock,
  Cpu,
  Download,
  ExternalLink,
  Loader2,
  Plus,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { StoreResponse } from "@/@types/store/store-response";
import { TransactionResponse } from "@/@types/transaction/transaction-response";
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
      console.error("Erro ao carregar transações", err);
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
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Não foi possível carregar os dados desta instância.");
      }
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

        <main className="min-h-screen bg-[#F4F7FA] font-sans text-slate-900 flex items-center justify-center">
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

        <main className="min-h-screen bg-[#F4F7FA] font-sans text-slate-900 mx-auto max-w-400 px-6 pt-40 pb-20">
          <div className="flex flex-col items-center justify-center gap-6 rounded-[3rem] border border-red-100 bg-red-50/30 p-16 text-center">
            <AlertCircle size={64} className="text-red-500" />
            <div className="max-w-xl space-y-4">
              <h2 className="text-4xl font-black tracking-tighter text-slate-950 uppercase italic">
                Instância Não Localizada.
              </h2>
              <p className="text-lg font-medium text-slate-500 italic leading-relaxed">
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
              <Download size={14} /> EXPORTAR RELATÓRIO
            </button>
            <button className="flex flex-1 items-center justify-center gap-3 rounded-xl bg-slate-950 px-6 py-4 text-[10px] font-black tracking-widest text-white shadow-2xl transition-all hover:bg-indigo-600 active:scale-95 lg:flex-none">
              <Plus size={16} /> ADICIONAR PRODUTO
            </button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              rotulo: "Fluxo de Vendas",
              valor: "R$ 0,00",
              sub: "Volume acumulado 24h",
              icon: Activity,
            },
            {
              rotulo: "Disponibilidade",
              valor: "99.99%",
              sub: "SLA de serviço estável",
              icon: ShieldCheck,
            },
            {
              rotulo: "Taxa de Requisições",
              valor: "1.240 req/s",
              sub: "Pico de processamento",
              icon: Cpu,
            },
            {
              rotulo: "Conversão Global",
              valor: "0.00%",
              sub: "Métrica em sincronização",
              icon: BarChart3,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-slate-50 p-2 text-indigo-600">
                  <stat.icon size={18} />
                </div>
                <div
                  className={`h-1.5 w-1.5 rounded-full bg-emerald-500 ${
                    store.isActive ? "animate-pulse" : "opacity-20"
                  }`}
                />
              </div>
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                {stat.rotulo}
              </p>
              <h3 className="mt-1 text-2xl font-black tracking-tighter text-slate-950 italic">
                {stat.valor}
              </h3>
              <p className="mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:col-span-8">
            <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6">
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-emerald-500" />
                <h2 className="text-xs font-black tracking-widest text-slate-950 uppercase italic">
                  ÚLTIMAS TRANSAÇÕES
                </h2>
              </div>
              <button
                onClick={fetchTransactions}
                disabled={isTransactionsLoading}
                className="rounded-lg bg-slate-50 p-2 text-slate-400 transition-colors hover:text-indigo-600 disabled:opacity-50"
              >
                <RefreshCcw
                  size={14}
                  className={isTransactionsLoading ? "animate-spin" : ""}
                />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50 text-[9px] font-black tracking-widest text-slate-400 uppercase">
                    <th className="py-4 pl-8">ID DA TRANSAÇÃO</th>
                    <th className="py-4">MÉTODO</th>
                    <th className="py-4">STATUS</th>
                    <th className="py-4 pr-8 text-right">VALOR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="group transition-colors hover:bg-slate-50/80"
                      >
                        <td className="py-5 pl-8 text-sm font-black text-slate-950 italic">
                          #TXN-{tx.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {getPaymentMethodLabel(tx.paymentMethod)}
                        </td>
                        <td className="py-5">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-[9px] font-black tracking-widest text-emerald-600 uppercase">
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-5 pr-8 text-right text-sm font-black text-slate-950">
                          R$ {tx.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-20 text-center text-[10px] font-black tracking-widest text-slate-300 uppercase italic"
                      >
                        {isTransactionsLoading
                          ? "Sincronizando logs..."
                          : "Nenhuma transação registrada no período"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl shadow-slate-200">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tighter uppercase italic text-indigo-400">
                  Inventory Alert
                </h3>
                <AlertTriangle className="text-orange-500" size={20} />
              </div>
              <div className="py-4 text-center">
                <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase italic">
                  Estoque em conformidade técnica
                </p>
              </div>
              <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 text-[10px] font-black tracking-widest text-slate-950 uppercase transition-all hover:bg-indigo-500 hover:text-white">
                REABASTECER AGORA <ArrowRight size={14} />
              </button>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-sm font-black tracking-widest text-slate-950 uppercase italic">
                  Ações Rápidas
                </h3>
                <Clock size={16} className="text-slate-300" />
              </div>
              <div className="space-y-3">
                {[
                  { label: "Configurações do Checkout", icon: ShieldCheck },
                  { label: "Personalizar Vitrine", icon: Box },
                  { label: "Logs de Integração", icon: ExternalLink },
                ].map((action, i) => (
                  <button
                    key={i}
                    className="group flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-indigo-600 hover:bg-indigo-50"
                  >
                    <div className="flex items-center gap-3">
                      <action.icon
                        size={16}
                        className="text-slate-400 group-hover:text-indigo-600"
                      />
                      <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase group-hover:text-indigo-600">
                        {action.label}
                      </span>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-slate-300 group-hover:text-indigo-600"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StoreDashboardPage;
