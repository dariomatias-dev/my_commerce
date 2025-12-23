"use client";

export const dynamic = "force-dynamic";

import { LockKeyholeIcon } from "lucide-react";
import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/(auth)/reset-password/reset-password-form";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

const ResetPasswordPage = () => {
  return (
    <>
      <Header />

      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white p-6 font-sans text-slate-900">
        <div className="relative z-10 w-full max-w-lg">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 md:p-14">
            <Suspense fallback={null}>
              <ResetPasswordForm />
            </Suspense>
          </div>

          <div className="mt-8 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-slate-300 uppercase italic">
              <LockKeyholeIcon size={12} className="text-indigo-400" />
              Conta Protegida
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ResetPasswordPage;
