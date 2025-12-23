"use client";

import { Sparkles } from "lucide-react";

import { ResendVerificationForm } from "@/components/(auth)/resend-verification-email/resend-verification-form";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function ResendVerificationPage() {
  return (
    <>
      <Header />

      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white p-6 font-sans text-slate-900">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-[-5%] right-[-5%] h-[60%] w-[50%] rounded-full bg-indigo-50/50 opacity-60 blur-[120px]" />
          <div className="absolute bottom-[-5%] left-[-5%] h-[50%] w-[40%] rounded-full bg-violet-50/40 opacity-60 blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] brightness-100 contrast-150" />
          <div className="absolute top-0 left-1/4 h-full w-px bg-linear-to-b from-transparent via-slate-100 to-transparent" />
          <div className="absolute top-0 right-1/4 h-full w-px bg-linear-to-b from-transparent via-slate-100 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-lg">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] md:p-14">
            <ResendVerificationForm />
          </div>

          <p className="mt-8 text-center text-[10px] font-bold tracking-[0.3em] text-slate-300 uppercase italic">
            <Sparkles size={12} className="mr-2 inline text-indigo-400" />
            Sistema de Ativação MyEcommerce
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}
