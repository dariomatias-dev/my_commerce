"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, RefreshCw, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Feedback } from "@/components/feedback";
import { useAuthContext } from "@/contexts/auth-context";
import { useFeedback } from "@/hooks/use-feedback";
import { useUser } from "@/services/hooks/use-user";

const profileSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.email("E-mail inválido"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileInfoForm = () => {
  const { feedback, showFeedback } = useFeedback();

  const { user, refreshUser } = useAuthContext();
  const { updateMe } = useUser();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsLoading(true);

      await updateMe(data);
      await refreshUser();

      showFeedback("success", "Perfil atualizado com sucesso.");
    } catch (error) {
      if (error instanceof Error) {
        showFeedback("error", error.message);
      } else {
        showFeedback("success", "Erro ao atualizar perfil.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <Feedback
          message={feedback.message}
          type={feedback.type}
          onClose={() => showFeedback("success", "")}
        />
      )}

      <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 md:p-12 shadow-sm">
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600">
            <User size={24} />
          </div>

          <div>
            <h2 className="text-xl font-black tracking-tighter text-slate-950 uppercase italic">
              Informações Pessoais
            </h2>

            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Dados básicos da sua conta
            </p>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Nome Completo
              </label>

              <input
                {...form.register("name")}
                className="w-full rounded-xl border border-slate-100 bg-slate-50 py-3.5 px-4 font-bold text-slate-950 outline-none focus:border-indigo-600 transition-all"
              />

              {form.formState.errors.name && (
                <p className="text-[9px] font-black text-red-500 uppercase">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                E-mail Corporativo
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={16}
                />

                <input
                  {...form.register("email")}
                  disabled
                  className="w-full rounded-xl border border-slate-100 bg-slate-50 py-3.5 pl-11 pr-4 font-bold text-slate-400 outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-slate-950 px-8 py-3 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-indigo-600 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                "SALVAR ALTERAÇÕES"
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
