"use client";

import { ArrowLeft, ShieldCheck, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { AdminUserResponse } from "@/@types/user/admin-user-response";
import { UserCard } from "@/components/admin/users/user-card";
import { ErrorFeedback } from "@/components/error-feedback";
import { LoadingIndicator } from "@/components/loading-indicator";
import { Pagination } from "@/components/pagination";
import { useUser } from "@/services/hooks/use-user";

const UserManagementPage = () => {
  const router = useRouter();
  const { getAllUsers } = useUser();

  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getAllUsers(currentPage, 10);

      setUsers(response.content || []);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível carregar a base de usuários.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [getAllUsers, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (isLoading) {
    return <LoadingIndicator message="Sincronizando base de usuários..." />;
  }

  if (errorMessage) {
    return (
      <ErrorFeedback
        title="Gestão de"
        highlightedTitle="Usuários"
        errorMessage={errorMessage}
        onRetry={fetchUsers}
        backPath="/dashboard/admin"
        backLabel="VOLTAR AO CONSOLE"
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

      <div className="mb-12 flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-8 md:flex-row md:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex items-center gap-2 rounded bg-indigo-600 px-2 py-0.5 text-[9px] font-black tracking-widest text-white uppercase">
              <ShieldCheck size={10} />
              USER_MANAGEMENT
            </div>
            <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase italic">
              Controle de acessos e governança de contas
            </span>
          </div>

          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-slate-950 md:text-5xl">
            GESTÃO DE <span className="text-indigo-600">USUÁRIOS.</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
            <Users size={20} />
          </div>
          <div className="pr-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              Total Registrado
            </p>
            <p className="text-lg font-black text-slate-950">
              {String(totalElements).padStart(2, "0")} Contas
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        <div className="grid grid-cols-1 gap-4">
          {users.map((u) => (
            <UserCard key={u.id} user={u} onDeleteSuccess={fetchUsers} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
};

export default UserManagementPage;
