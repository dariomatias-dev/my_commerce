"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { ActionButton } from "@/components/action-button";
import { PasswordField } from "@/components/password-field";

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
          E-mail
        </label>
        <div className="group relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-300 transition-colors group-focus-within:text-indigo-600">
            <Mail size={18} />
          </div>
          <input
            type="email"
            required
            placeholder="seu@email.com"
            className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pr-4 pl-12 font-bold text-slate-900 transition-all placeholder:text-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:outline-none"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
            Senha
          </label>
          <Link
            href="/forgot"
            className="text-[10px] font-black tracking-widest text-indigo-600 uppercase transition-colors hover:text-indigo-700"
          >
            Esqueceu a senha?
          </Link>
        </div>

        <PasswordField
          value={formData.password}
          onChange={(value) => setFormData({ ...formData, password: value })}
        />
      </div>

      <ActionButton label="ENTRAR" />
    </form>
  );
}
