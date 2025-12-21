"use client";

import { Mail, User } from "lucide-react";
import React, { useState } from "react";

import { ActionButton } from "@/components/action-button";
import { PasswordField } from "@/components/password-field";

export const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
          Nome Completo
        </label>
        <div className="group relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-300 transition-colors group-focus-within:text-indigo-600">
            <User size={18} />
          </div>
          <input
            type="text"
            required
            placeholder="Ex: João Silva"
            className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pr-4 pl-12 font-bold text-slate-900 shadow-sm transition-all placeholder:text-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
          E-mail Corporativo
        </label>
        <div className="group relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-300 transition-colors group-focus-within:text-indigo-600">
            <Mail size={18} />
          </div>
          <input
            type="email"
            required
            placeholder="seu@email.com"
            className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pr-4 pl-12 font-bold text-slate-900 shadow-sm transition-all placeholder:text-slate-300 focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-600/20 focus:outline-none"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
          Senha
        </label>
        <PasswordField
          value={formData.password}
          onChange={(value) => setFormData({ ...formData, password: value })}
        />
      </div>

      <div className="space-y-2">
        <label className="ml-1 text-xs font-black tracking-widest text-slate-400 uppercase">
          Confirmar Senha
        </label>
        <PasswordField
          value={formData.confirmPassword}
          onChange={(value) =>
            setFormData({ ...formData, confirmPassword: value })
          }
        />
      </div>

      <ActionButton label="CRIAR MINHA CONTA" />
    </form>
  );
};
