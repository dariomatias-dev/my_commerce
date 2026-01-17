"use client";

import {
  ChevronRight,
  CreditCard,
  Database,
  Lock,
  LucideIcon,
  MapPin,
  Settings2,
  ShieldCheck,
  User,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { DashboardPageHeader } from "@/components/layout/dashboard-page-header";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SettingsAddresses } from "@/components/profile/profile-addresses";
import { SettingsAdvancedSettings } from "@/components/profile/settings-advanced-settings";
import { SettingsInfoForm } from "@/components/profile/settings-info-form";
import { SettingsSecurityForm } from "@/components/profile/settings-security-form";
import { SettingsSubscriptions } from "@/components/profile/settings-subscriptions";

type SettingsTab =
  | "profile"
  | "addresses"
  | "subscriptions"
  | "security"
  | "advanced";

const SettingsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab") as SettingsTab;
  const activeTab: SettingsTab = [
    "profile",
    "addresses",
    "subscriptions",
    "security",
    "advanced",
  ].includes(currentTab)
    ? currentTab
    : "profile";

  const tabs: { id: SettingsTab; label: string; icon: LucideIcon }[] = [
    { id: "profile", label: "Informações Pessoais", icon: User },
    { id: "addresses", label: "Meus Endereços", icon: MapPin },
    { id: "subscriptions", label: "Assinaturas", icon: CreditCard },
    { id: "security", label: "Segurança & Senha", icon: Lock },
    { id: "advanced", label: "Configurações Avançadas", icon: Settings2 },
  ];

  const handleTabChange = (tabId: SettingsTab) => {
    router.push(`?tab=${tabId}`, { scroll: false });
  };

  return (
    <>
      <Header />

      <main className="min-h-screen mx-auto max-w-400 px-6 pt-32 pb-12">
        <DashboardPageHeader
          title="Minhas Configurações"
          subtitle="Gerencie suas credenciais e segurança de acesso"
          label="Configurações do Usuário"
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
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
                    className={
                      activeTab === tab.id ? "opacity-100" : "opacity-0"
                    }
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
              {activeTab === "profile" && <SettingsInfoForm />}
              {activeTab === "addresses" && <SettingsAddresses />}
              {activeTab === "subscriptions" && <SettingsSubscriptions />}
              {activeTab === "security" && <SettingsSecurityForm />}
              {activeTab === "advanced" && <SettingsAdvancedSettings />}

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

export default SettingsPage;
