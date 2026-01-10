"use client";

import { ArrowLeft, Save, User, UserCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { ErrorFeedback } from "@/components/error-feedback";
import { LoadingIndicator } from "@/components/loading-indicator";
import { useUser } from "@/services/hooks/use-user";

const AdminUserEditPage = () => {
  const router = useRouter();

  const { userId } = useParams() as {
    userId: string;
  };

  const { getUserById, updateUser } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const user = await getUserById(userId);

      setName(user.name);
      setEmail(user.email);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "Não foi possível carregar os dados do perfil do usuário."
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, getUserById]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateUser(userId, { name });

      router.push("/admin/users");

      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível atualizar o perfil do usuário.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator message="Carregando dados do perfil..." />;
  }

  if (errorMessage) {
    return (
      <ErrorFeedback
        title="Perfil"
        highlightedTitle="Indisponível"
        errorMessage={errorMessage}
        onRetry={fetchProfile}
        backPath="/admin/users"
        backLabel="VOLTAR AO PAINEL"
      />
    );
  }

  return (
    <main className="min-h-screen mx-auto max-w-400 px-6 pt-32 pb-12">
      <button
        onClick={() => router.back()}
        className="group mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-indigo-600"
      >
        <ArrowLeft
          size={16}
          className="transition-transform group-hover:-translate-x-1"
        />
        Voltar
      </button>

      <div className="mb-12 border-b border-slate-200 pb-8">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex items-center gap-2 rounded bg-indigo-600 px-2 py-0.5 text-[9px] font-black tracking-widest text-white uppercase">
            <User size={10} />
            EDIT_MODE
          </div>
          <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase italic">
            Atualize informações de identificação
          </span>
        </div>

        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-950 md:text-5xl">
          EDITAR <span className="text-indigo-600">PERFIL.</span>
        </h1>
      </div>

      <div className="w-full">
        <form
          onSubmit={handleSubmit}
          className="rounded-[2.5rem] border border-slate-200 bg-white p-8 md:p-12 shadow-sm transition-all animate-in fade-in slide-in-from-bottom-4"
        >
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-indigo-600">
                <UserCheck size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-slate-950">
                  Dados Básicos
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Identificação no console operacional
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-950 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50"
                  placeholder="Ex: João Silva"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  E-mail (Não alterável)
                </label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-100 px-6 py-4 text-sm font-bold text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex w-full lg:w-fit min-w-70 items-center justify-center gap-3 rounded-2xl bg-slate-950 px-10 py-5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-indigo-600 disabled:opacity-50 active:scale-95"
              >
                {isSaving ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  <>
                    <Save size={16} />
                    SALVAR ALTERAÇÕES
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-[9px] font-black tracking-widest text-slate-400 uppercase italic">
          <span className="h-1 w-1 rounded-full bg-indigo-400" />
          As alterações serão sincronizadas globalmente
        </div>
      </div>
    </main>
  );
};

export default AdminUserEditPage;
