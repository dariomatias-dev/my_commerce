"use client";

import { CheckCircle2, ShieldAlert } from "lucide-react";
import { useState } from "react";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Footer } from "@/components/layout/footer";
import { ProfileDangerZone } from "@/components/profile/profile-danger-zone";
import { ProfileInfoForm } from "@/components/profile/profile-info-form";
import { ProfileSecurityForm } from "@/components/profile/profile-security-form";

const ProfilePage = () => {
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans text-slate-900">
      <DashboardHeader />

      <main className="mx-auto max-w-5xl px-6 pt-32 pb-12">
        <div className="mb-12 border-b border-slate-200 pb-8">
          <h1 className="text-5xl font-black tracking-tighter text-slate-950 uppercase italic">
            MEU <span className="text-indigo-600">PERFIL.</span>
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-400 uppercase italic">
            Gerencie suas credenciais e preferências de segurança.
          </p>
        </div>

        {feedback && (
          <div
            className={`mb-8 flex items-center gap-3 rounded-2xl p-4 animate-in fade-in zoom-in-95 ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <ShieldAlert size={20} />
            )}
            <p className="text-xs font-black uppercase tracking-widest">
              {feedback.message}
            </p>
          </div>
        )}

        <div className="grid gap-8">
          <ProfileInfoForm setFeedback={setFeedback} />

          <ProfileSecurityForm setFeedback={setFeedback} />

          <ProfileDangerZone />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
