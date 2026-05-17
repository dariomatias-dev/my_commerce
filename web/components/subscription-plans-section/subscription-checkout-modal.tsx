"use client";

import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SubscriptionPlanResponse } from "@/@types/subscription-plan/subscription-plan-response";
import {
  changeSubscriptionPlan,
  createSubscription,
} from "@/app/actions/subscriptions";
import { useAuthContext } from "@/contexts/auth-context";
import { getMyActiveSubscription } from "@/services/subscriptions";
import { AuthRequiredDialog } from "./auth-required-dialog";

interface SubscriptionCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlanResponse | null;
}

export const SubscriptionCheckoutModal = ({
  isOpen,
  onClose,
  plan,
}: SubscriptionCheckoutModalProps) => {
  const router = useRouter();

  const { refreshUser, isAuthenticated } = useAuthContext();

  const [isProcessing, setIsProcessing] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAuthAlert, setShowAuthAlert] = useState(false);

  const handleClose = () => {
    setShowAuthAlert(false);
    onClose();
  };

  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;

    let ignore = false;

    async function checkActiveSubscription() {
      try {
        const activeSub = await getMyActiveSubscription();

        if (!ignore && activeSub) setActivePlanId(activeSub.planId);
      } catch {
        if (!ignore) setActivePlanId(null);
      }
    }

    checkActiveSubscription();

    return () => {
      ignore = true;
    };
  }, [isOpen, isAuthenticated]);

  const handleConfirmSubscription = async () => {
    if (!plan) return;

    if (!isAuthenticated) {
      setShowAuthAlert(true);

      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const result = activePlanId
      ? await changeSubscriptionPlan({ planId: plan.id })
      : await createSubscription({ planId: plan.id });

    setIsProcessing(false);

    if (!result.success) {
      setErrorMessage(result.error);

      return;
    }

    router.push("/dashboard");
    router.refresh();

    refreshUser();

    handleClose();
  };

  if (!isOpen || !plan) return null;

  if (showAuthAlert) {
    return (
      <AuthRequiredDialog
        isOpen={showAuthAlert}
        onClose={() => setShowAuthAlert(false)}
      />
    );
  }

  const isUpgrade = activePlanId && activePlanId !== plan.id;

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl animate-in zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-50/10 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="bg-slate-950 p-10 text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-600/20 px-4 py-1.5 text-indigo-400">
            <Zap size={14} fill="currentColor" />

            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              Checkout Seguro
            </span>
          </div>

          <h2 className="text-4xl font-black uppercase italic tracking-tighter">
            {isUpgrade ? "Alterar" : "Ativar"} <br />
            <span className="text-indigo-500">Plano {plan.name}.</span>
          </h2>

          <div className="mt-8 flex items-baseline gap-2">
            <span className="text-5xl font-black italic tracking-tighter">
              R$ {plan.price}
            </span>

            <span className="text-sm font-bold uppercase tracking-widest text-slate-500">
              / mensal
            </span>
          </div>
        </div>

        <div className="p-10">
          {errorMessage && (
            <div className="mb-8 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-600 animate-in fade-in slide-in-from-top-2">
              <AlertTriangle size={18} className="shrink-0" />

              <p className="text-[10px] font-black uppercase tracking-tight leading-tight">
                {errorMessage}
              </p>
            </div>
          )}

          <div className="mb-8 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              O que está incluso:
            </p>

            <div className="grid gap-3">
              <div className="flex items-center gap-3 text-xs font-bold italic text-slate-600">
                <CheckCircle2 size={16} className="text-emerald-500" />

                {plan.maxStores === -1
                  ? "Lojas Ilimitadas"
                  : `${plan.maxStores} Lojas`}
              </div>

              <div className="flex items-center gap-3 text-xs font-bold italic text-slate-600">
                <CheckCircle2 size={16} className="text-emerald-500" />

                {plan.maxProducts === -1
                  ? "Produtos Ilimitados"
                  : `${plan.maxProducts} Produtos`}
              </div>

              <div className="flex items-center gap-3 text-xs font-bold italic text-slate-600">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Suporte Prioritário 24/7
              </div>
            </div>
          </div>

          <div className="mb-10 flex items-start gap-4 rounded-2xl bg-slate-50 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <ShieldCheck size={20} />
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-tight text-slate-950">
                Garantia de Satisfação
              </p>

              <p className="mt-1 text-[10px] font-medium leading-relaxed text-slate-500">
                Sua assinatura será ativada instantaneamente após a confirmação.
                Cancele quando quiser.
              </p>
            </div>
          </div>

          <button
            onClick={handleConfirmSubscription}
            disabled={isProcessing}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-slate-950 py-5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-600 active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <CreditCard size={18} />

                <span>Confirmar e Ativar Agora</span>
              </>
            )}
          </button>

          <p className="mt-6 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300">
            Ao confirmar, você concorda com nossos termos de uso
          </p>
        </div>
      </div>
    </div>
  );
};
