"use client";

import { Filter, Search, Users, UserX } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { AdminUserResponse } from "@/@types/user/admin-user-response";
import { UserRole } from "@/@types/user/user-response";
import { UserCard } from "@/components/admin/users/user-card";
import { DashboardTotalBadge } from "@/components/dashboard-total-badge";
import { Dropdown } from "@/components/dropdown";
import { ErrorFeedback } from "@/components/error-feedback";
import { StatusDropdownFilter } from "@/components/filters/status-dropdown-filter";
import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { LoadingIndicator } from "@/components/loading-indicator";
import { Pagination } from "@/components/pagination";
import { StatusFilter } from "@/enums/status-filter";
import { useUser } from "@/services/hooks/use-user";

const UserManagementPage = () => {
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
  const [statusFilter, setStatusFilter] = useState<string>(StatusFilter.ALL);

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
        status: (statusFilter as StatusFilter) || undefined,
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
  }, [
    getAllUsers,
    currentPage,
    searchName,
    searchEmail,
    roleFilter,
    statusFilter,
  ]);

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

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
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
    <>
      <DashboardPageHeader
        title="GESTÃO DE USUÁRIOS"
        subtitle={`Página ${currentPage + 1} de ${
          totalPages || 1
        } — Controle de acessos e governança de contas`}
        label="USUÁRIOS"
        backPath="/admin"
        actions={
          <DashboardTotalBadge
            icon={Users}
            value={totalElements}
            unit="Contas"
          />
        }
      />

      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-col gap-4 md:flex-row">
          <div className="group relative flex-1">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500"
              size={18}
            />
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="BUSCAR POR NOME..."
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pr-6 pl-12 text-[11px] font-bold tracking-widest text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5"
            />
          </div>

          <div className="group relative flex-1">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-500"
              size={18}
            />
            <input
              type="text"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="BUSCAR POR E-MAIL..."
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pr-6 pl-12 text-[11px] font-bold tracking-widest text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Dropdown
            icon={Filter}
            options={roleOptions}
            value={roleFilter}
            onChange={handleRoleChange}
            placeholder="Filtrar Cargo"
            className="w-full sm:w-60"
          />
          <StatusDropdownFilter
            value={statusFilter}
            onChange={handleStatusChange}
          />
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-4">
          {users.length > 0 ? (
            users.map((u) => (
              <UserCard key={u.id} user={u} onDeleteSuccess={fetchUsers} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 py-24 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                <UserX className="text-slate-300" size={32} />
              </div>
              <p className="max-w-xs text-[11px] font-bold uppercase leading-relaxed tracking-[0.2em] text-slate-400">
                Nenhum usuário localizado com os critérios selecionados
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
    </>
  );
};

export default UserManagementPage;
