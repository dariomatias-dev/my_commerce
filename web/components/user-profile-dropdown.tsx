"use client";

import { ChevronDown, Home, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useAuthContext } from "@/contexts/auth-context";

export const UserProfileDropdown = () => {
  const { user, logout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 transition-all hover:border-indigo-600"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-[10px] font-black text-white italic">
          {initials}
        </div>
        <div className="hidden text-left lg:block">
          <p className="text-[10px] font-black tracking-tight text-slate-950 uppercase">
            {user?.name || "Usuário"}
          </p>
          <p className="text-[8px] font-bold tracking-widest text-indigo-600 uppercase">
            Plano Free
          </p>
        </div>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="animate-in fade-in zoom-in-95 absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl">
          <div className="mb-2 px-3 py-2">
            <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
              Minha Conta
            </p>
          </div>

          <Link
            href="/profile"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-indigo-600"
          >
            <User size={16} /> Meu Perfil
          </Link>

          <Link
            href="/dashboard"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-indigo-600"
          >
            <Home size={16} /> Dashboard
          </Link>

          <Link
            href="/settings"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-indigo-600"
          >
            <Settings size={16} /> Configurações
          </Link>

          <div className="my-2 h-px bg-slate-100" />

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold text-red-500 transition-all hover:bg-red-50"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  );
};
