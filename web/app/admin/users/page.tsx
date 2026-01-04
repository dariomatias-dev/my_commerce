"use client";

import {
  AlertCircle,
  ArrowLeft,
  RefreshCcw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { AdminUserResponse } from "@/@types/user/admin-user-response";
import { UserCard } from "@/components/admin/users/user-card";
import { LoadingIndicator } from "@/components/dashboard/loading-indicator";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
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
    return (
      <>
        <Header />

        <LoadingIndicator message="Carregando usuários..." />

        <Footer />
      </>
    );
  }

  if (errorMessage) {
    return (
      <>
        <Header />

        <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
          <div className="mb-6 h-20 w-20 flex items-center justify-center rounded-[2rem] bg-red-50 text-red-500">
            <AlertCircle size={40} />
          </div>

          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-950">
            Falha no <span className="text-red-500">Gerenciamento</span>
          </h2>

          <button
            onClick={fetchUsers}
            className="mt-8 flex items-center gap-2 rounded-xl bg-slate-950 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-indigo-600"
          >
            <RefreshCcw size={14} /> Tentar Novamente
          </button>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="grow bg-[#FBFBFC] pb-40 pt-35">
        <div className="mx-auto max-w-5xl px-6">
          <button
            onClick={() => router.back()}
            className="group mb-12 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-indigo-600"
          >
            <ArrowLeft size={16} /> Voltar
          </button>

          <div className="mb-16 flex flex-col items-start justify-between gap-6 border-b border-slate-100 pb-12 md:flex-row md:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1">
                <ShieldCheck size={12} className="text-indigo-600" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600">
                  Administração
                </span>
              </div>

              <h1 className="text-6xl font-black uppercase italic tracking-tighter text-slate-950 md:text-7xl">
                Gestão de <span className="text-indigo-600">Usuários.</span>
              </h1>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                <Users size={20} />
              </div>
              <div className="pr-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Total
                </p>
                <p className="text-lg font-black text-slate-950">
                  {totalElements} Contas
                </p>
              </div>
            </div>
          </div>

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

      <Footer />
    </>
  );
};

export default UserManagementPage;
