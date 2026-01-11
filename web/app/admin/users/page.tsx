"use client";

import { ArrowLeft, Filter, Search, ShieldCheck, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { AdminUserResponse } from "@/@types/user/admin-user-response";
import { UserRole } from "@/@types/user/user-response";
import { UserCard } from "@/components/admin/users/user-card";
import { Dropdown } from "@/components/dropdown";
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

  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const roleOptions = [
    { id: "", name: "Todos os Cargos" },
    { id: "ADMIN", name: "ADMINISTRADOR" },
    { id: "SUBSCRIBER", name: "ASSINANTE" },
    { id: "USER", name: "USUÁRIO" },
  ];

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const filters = {
        name: searchName || undefined,
        email: searchEmail || undefined,
        role: (roleFilter as UserRole) || undefined,
      };

      const response = await getAllUsers(filters, currentPage, 10);

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
  }, [getAllUsers, currentPage, searchName, searchEmail, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setSearchName(nameInput);
      setSearchEmail(emailInput);
      setCurrentPage(0);
    }
  };

  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(0);
  };

  if (isLoading && users.length === 0) {
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

      <div className="mb-12 flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-12 md:flex-row md:items-end">
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
              Total Encontrado
            </p>
            <p className="text-lg font-black text-slate-950">
              {String(totalElements).padStart(2, "0")} Contas
            </p>
          </div>
        </div>
      </div>

      <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="relative group flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
            size={16}
          />
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="PESQUISAR NOME (ENTER)..."
            className="h-14.5 w-full rounded-2xl border-2 border-slate-100 bg-slate-50 pl-12 pr-6 text-[10px] font-black tracking-widest text-slate-950 outline-none transition-all focus:border-indigo-600 focus:bg-white"
          />
        </div>

        <div className="relative group flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
            size={16}
          />
          <input
            type="text"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="PESQUISAR E-MAIL (ENTER)..."
            className="h-14.5 w-full rounded-2xl border-2 border-slate-100 bg-slate-50 pl-12 pr-6 text-[10px] font-black tracking-widest text-slate-950 outline-none transition-all focus:border-indigo-600 focus:bg-white"
          />
        </div>

        <Dropdown
          icon={Filter}
          options={roleOptions}
          value={roleFilter}
          onChange={handleRoleChange}
          placeholder="Filtrar Cargo"
          className="w-full lg:w-64"
        />
      </div>

      <div className="space-y-10">
        <div className="grid grid-cols-1 gap-4">
          {users.length > 0 ? (
            users.map((u) => (
              <UserCard key={u.id} user={u} onDeleteSuccess={fetchUsers} />
            ))
          ) : (
            <div className="rounded-[2rem] border-2 border-dashed border-slate-100 py-20 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">
                Nenhum usuário localizado com estes critérios
              </p>
            </div>
          )}
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
