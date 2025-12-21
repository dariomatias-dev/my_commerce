"use client";

import { Sparkles } from "lucide-react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { VerifyEmailForm } from "../../../components/(auth)/verify-email/verify-email-form";

const VerifyEmailPage = () => {
  return (
    <>
      <Header />

      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white p-6 font-sans text-slate-900">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-[-5%] right-[-5%] h-[60%] w-[50%] rounded-full bg-indigo-50/50 opacity-60 blur-[120px]" />
          <div className="absolute bottom-[-5%] left-[-5%] h-[50%] w-[40%] rounded-full bg-violet-50/40 opacity-60 blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150" />

          <div className="absolute top-0 left-1/4 h-full w-px bg-gradient-to-b from-transparent via-slate-100 to-transparent" />
          <div className="absolute top-0 right-1/4 h-full w-px bg-gradient-to-b from-transparent via-slate-100 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <VerifyEmailForm />

          <p className="mt-8 text-center text-[10px] font-bold tracking-[0.3em] text-slate-300 uppercase italic">
            <Sparkles size={12} className="mr-2 inline text-indigo-400" />
            Verificação de identidade segura
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default VerifyEmailPage;
