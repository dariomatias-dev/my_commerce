"use client";

import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  CreditCard,
  Loader2,
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { SubscriptionResponse } from "@/@types/subscription/subscription-response";
import { ConfirmDialog } from "@/components/dialogs/confirm-dialog";
import { useSubscription } from "@/services/hooks/use-subscription";
import { useAuthContext } from "@/contexts/auth-context";

export const SettingsSubscriptions = () => {
  const { getMySubscriptions, getMyActiveSubscription, cancelSubscription } =
    useSubscription();

  const { setSubscription } = useAuthContext();

  const [subscriptions, setSubscriptions] = useState<SubscriptionResponse[]>(
    [],
  );
  const [activeSub, setActiveSub] = useState<SubscriptionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const [history, active] = await Promise.all([
        getMySubscriptions(0, 10),
        getMyActiveSubscription().catch(() => null),
      ]);

      setSubscriptions(history.content || []);
      setActiveSub(active);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível carregar os dados das assinaturas.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getMySubscriptions, getMyActiveSubscription]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCancelSubscription = async () => {
    try {
      setIsCancelling(true);
      setErrorMessage(null);

      await cancelSubscription();
      await fetchData();

      setSubscription(null);

      setIsCancelDialogOpen(false);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Ocorreu um erro ao tentar cancelar sua assinatura.");
      }
      setIsCancelDialogOpen(false);
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />

        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Carregando assinaturas...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {errorMessage && (
        <div className="relative flex items-center gap-4 rounded-2xl bg-red-50 p-6 pr-14 text-red-600 animate-in fade-in slide-in-from-top-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
            <AlertTriangle size={20} />
          </div>

          <div>
            <p className="text-[11px] font-black uppercase tracking-widest">
              Falha na Operação
            </p>

            <p className="text-[10px] font-bold opacity-80 uppercase">
              {errorMessage}
            </p>
          </div>

          <button
            onClick={() => setErrorMessage(null)}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 hover:bg-red-200/50 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-950 italic">
            Assinatura Ativa
          </h3>

          {activeSub?.isActive && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-600">
              Ativa e Protegida
            </span>
          )}
        </div>

        {activeSub?.isActive ? (
          <div className="group relative overflow-hidden rounded-[2.5rem] border-2 border-slate-950 bg-white p-8 shadow-2xl shadow-slate-100">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-indigo-400">
                  <CheckCircle2 size={32} />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                    ID: {activeSub.id}
                  </p>

                  <h4 className="text-4xl font-black uppercase italic tracking-tighter text-slate-950">
                    Assinatura
                  </h4>
                </div>
              </div>

              <button
                onClick={() => setIsCancelDialogOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-red-50 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 transition-all hover:bg-red-50 hover:border-red-100 active:scale-95"
              >
                <XCircle size={14} /> Cancelar Assinatura
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 border-t border-slate-50 pt-8 md:grid-cols-2">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <Calendar size={18} />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Data de Início
                  </p>

                  <p className="text-xs font-bold text-slate-950 uppercase">
                    {new Date(activeSub.startDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <CreditCard size={18} />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Próxima Renovação
                  </p>

                  <p className="text-xs font-bold text-slate-950 uppercase">
                    {activeSub.endDate
                      ? new Date(activeSub.endDate).toLocaleDateString("pt-BR")
                      : "Sem data de expiração"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[2.5rem] border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
            <p className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">
              Nenhuma assinatura ativa vinculada à sua conta.
            </p>

            <button className="rounded-xl bg-slate-950 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-600 active:scale-95">
              Escolher um Plano
            </button>
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-950 italic">
          Histórico de Faturamento
        </h3>

        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Data Inicial
                  </th>

                  <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Expiração
                  </th>

                  <th className="px-8 py-5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {subscriptions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="group transition-colors hover:bg-slate-50/30"
                  >
                    <td className="px-8 py-5">
                      <span className="text-[11px] font-bold text-slate-600 uppercase">
                        {new Date(sub.startDate).toLocaleDateString("pt-BR")}
                      </span>
                    </td>

                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-slate-500 uppercase">
                        {sub.endDate
                          ? new Date(sub.endDate).toLocaleDateString("pt-BR")
                          : "Vigente"}
                      </span>
                    </td>

                    <td className="px-8 py-5">
                      <span
                        className={`text-[10px] font-black uppercase tracking-tighter ${
                          sub.isActive ? "text-emerald-600" : "text-slate-300"
                        }`}
                      >
                        {sub.isActive ? "PAGO / ATIVO" : "ENCERRADO"}
                      </span>
                    </td>
                  </tr>
                ))}

                {subscriptions.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-8 py-10 text-center text-[10px] font-black uppercase tracking-widest text-slate-300 italic"
                    >
                      Nenhum registro de faturamento encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ConfirmDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={handleCancelSubscription}
        isLoading={isCancelling}
        title="Cancelar Assinatura?"
        description="Ao confirmar, sua assinatura será desativada."
        confirmText="Sim, confirmar cancelamento"
        variant="danger"
      />
    </div>
  );
};
