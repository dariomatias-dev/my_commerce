"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react";

import { SubscriptionPlanResponse } from "@/@types/subscription-plan/subscription-plan-response";
import { changeSubscriptionPlan, createSubscription } from "@/app/actions/subscriptions";
import { useAuthContext } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { getMyActiveSubscription } from "@/services/subscriptions";

import { AuthRequiredDialog } from "./auth-required-dialog";

interface SubscriptionCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  plan: SubscriptionPlanResponse | null;
}

export const SubscriptionCheckoutModal = ({
  isOpen,
  onClose,
  onSuccess,
  plan,
}: SubscriptionCheckoutModalProps) => {
  const router = useRouter();

  const { refreshUser, isAuthenticated, user } = useAuthContext();
  const isAdmin = user?.role === "ADMIN";

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

    router.refresh();
    refreshUser();
    onSuccess?.();
    handleClose();
  };

  if (!isOpen || !plan) return null;

  if (showAuthAlert) {
    return <AuthRequiredDialog isOpen={showAuthAlert} onClose={() => setShowAuthAlert(false)} />;
  }

  const isUpgrade = activePlanId && activePlanId !== plan.id;

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center p-4">
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-950/40 backdrop-blur-md duration-300"
        onClick={handleClose}
      />

      <div className="animate-in zoom-in-95 relative w-full max-w-xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl duration-300">
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50/10 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="bg-slate-950 p-10 text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-600/20 px-4 py-1.5 text-indigo-400">
            <Zap size={14} fill="currentColor" />

            <span className="text-[10px] font-black tracking-[0.2em] uppercase">
              Checkout Seguro
            </span>
          </div>

          <h2 className="text-4xl font-black tracking-tighter uppercase italic">
            {isUpgrade ? "Alterar" : "Ativar"} <br />
            <span className="text-indigo-500">Plano {plan.name}.</span>
          </h2>

          <div className="mt-8 flex items-baseline gap-2">
            <span className="text-5xl font-black tracking-tighter italic">R$ {plan.price}</span>

            <span className="text-sm font-bold tracking-widest text-slate-500 uppercase">
              / mensal
            </span>
          </div>
        </div>

        <div className="p-10">
          {errorMessage && (
            <div className="animate-in fade-in slide-in-from-top-2 mb-8 flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-600">
              <AlertTriangle size={18} className="shrink-0" />

              <p className="text-[10px] leading-tight font-black tracking-tight uppercase">
                {errorMessage}
              </p>
            </div>
          )}

          <div className="mb-8 space-y-4">
            <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              O que está incluso:
            </p>

            <div className="grid gap-3">
              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 italic">
                <CheckCircle2 size={16} className="text-emerald-500" />

                {plan.maxStores === -1 ? "Lojas Ilimitadas" : `${plan.maxStores} Lojas`}
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 italic">
                <CheckCircle2 size={16} className="text-emerald-500" />

                {plan.maxProducts === -1 ? "Produtos Ilimitados" : `${plan.maxProducts} Produtos`}
              </div>

              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 italic">
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
              <p className="text-[11px] font-black tracking-tight text-slate-950 uppercase">
                Garantia de Satisfação
              </p>

              <p className="mt-1 text-[10px] leading-relaxed font-medium text-slate-500">
                Sua assinatura será ativada instantaneamente após a confirmação. Cancele quando
                quiser.
              </p>
            </div>
          </div>

          <button
            onClick={handleConfirmSubscription}
            disabled={isProcessing || isAdmin}
            className={cn(
              "group relative flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-2xl bg-slate-950 py-5 text-xs font-black tracking-widest text-white uppercase transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
              !(isProcessing || isAdmin) && "cursor-pointer hover:bg-indigo-600",
            )}
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

          <p className="mt-6 text-center text-[9px] font-bold tracking-[0.2em] text-slate-300 uppercase">
            Ao confirmar, você concorda com nossos termos de uso
          </p>
        </div>
      </div>
    </div>
  );
};
