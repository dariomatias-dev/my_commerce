import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

import { useAuthContext } from "@/contexts/auth-context";
import { UserProfileDropdown } from "../user-profile-dropdown";

interface NavAuthProps {
  isMobile?: boolean;
  onActionClick?: () => void;
}

export const HeaderNavAuth = ({
  isMobile = false,
  onActionClick,
}: NavAuthProps) => {
  const { isAuthenticated } = useAuthContext();

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">
        {isAuthenticated ? (
          <Link
            href="/dashboard"
            onClick={onActionClick}
            className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-indigo-600 font-black tracking-widest text-white uppercase italic"
          >
            <LayoutDashboard size={20} /> Painel de Controle
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              onClick={onActionClick}
              className="flex h-14 items-center justify-center rounded-2xl border border-slate-200 font-black tracking-widest text-slate-950 uppercase italic"
            >
              Fazer Login
            </Link>
            <Link
              href="/signup"
              onClick={onActionClick}
              className="flex h-14 items-center justify-center rounded-2xl bg-indigo-600 font-black tracking-widest text-white uppercase italic"
            >
              Começar Agora
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-5">
      {isAuthenticated ? (
        <UserProfileDropdown />
      ) : (
        <>
          <Link
            href="/login"
            className="text-[10px] font-black tracking-widest text-slate-950 uppercase transition-colors hover:text-indigo-600"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-xl bg-slate-950 px-8 py-3.5 text-[10px] font-black tracking-widest text-white uppercase shadow-2xl shadow-slate-200 transition-all hover:bg-indigo-600 active:scale-95"
          >
            Criar Conta
          </Link>
        </>
      )}
    </div>
  );
};
