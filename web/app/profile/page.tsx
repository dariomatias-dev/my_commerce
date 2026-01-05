"use client";

import { useState } from "react";
import { 
  User, 
  Lock, 
  Trash2, 
  ChevronRight, 
  ShieldCheck, 
  Database 
} from "lucide-react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ProfileInfoForm } from "@/components/profile/profile-info-form";
import { ProfileSecurityForm } from "@/components/profile/profile-security-form";
import { ProfileDangerZone } from "@/components/profile/profile-danger-zone";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("perfil");

  const tabs = [
    { id: "perfil", label: "Informações Pessoais", icon: User },
    { id: "seguranca", label: "Segurança & Senha", icon: Lock },
    { id: "perigo", label: "Zona de Perigo", icon: Trash2 },
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen mx-auto max-w-400 px-6 pt-32 pb-12">
        <div className="mb-8 border-b border-slate-200 pb-6">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded bg-indigo-600 px-2 py-0.5 text-[9px] font-black tracking-widest text-white uppercase">
              USER_PROFILE
            </div>
            <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase italic">
              Gerencie suas credenciais e segurança
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-950 uppercase italic">
            MEU <span className="text-indigo-600">PERFIL.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-5 py-4 transition-all ${
                    activeTab === tab.id
                      ? "bg-slate-950 border border-slate-950 text-white shadow-xl shadow-slate-200"
                      : "bg-white text-slate-500 border border-slate-100 hover:border-indigo-600/30 hover:text-slate-950"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon
                      size={16}
                      className={activeTab === tab.id ? "text-indigo-400" : ""}
                    />
                    <span className="text-[10px] font-black tracking-widest uppercase">
                      {tab.label}
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className={activeTab === tab.id ? "opacity-100" : "opacity-0"}
                  />
                </button>
              ))}
            </nav>

            <div className="mt-6 rounded-2xl bg-indigo-600 p-5 text-white shadow-md shadow-indigo-100">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={18} />
                <p className="text-[9px] font-black uppercase tracking-widest">
                  Privacidade Ativa
                </p>
              </div>
              <p className="text-[11px] font-medium leading-tight italic opacity-90">
                Seus dados são protegidos por criptografia de ponta a ponta.
              </p>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm transition-all animate-in fade-in slide-in-from-right-2">
              {activeTab === "perfil" && <ProfileInfoForm />}
              {activeTab === "seguranca" && <ProfileSecurityForm />}
              {activeTab === "perigo" && <ProfileDangerZone />}

              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-slate-400 uppercase italic">
                  <Database size={12} className="text-indigo-400" />
                  Sincronização em tempo real
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProfilePage;