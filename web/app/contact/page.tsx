"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  FileLock,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { ActionButton } from "@/components/buttons/action-button";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

const contactSchema = z.object({
  name: z.string().min(3, "Insira seu nome completo"),
  email: z.email("Insira um e-mail válido"),
  subject: z.string().min(5, "O assunto é muito curto"),
  message: z
    .string()
    .min(10, "A mensagem deve conter pelo menos 10 caracteres"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log(data);
  };

  return (
    <>
      <Header />

      <main className="relative mt-12 min-h-screen overflow-hidden bg-white font-sans text-slate-900">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute top-0 right-0 h-150 w-150 rounded-full bg-indigo-50/50 blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-125 w-125 rounded-full bg-slate-100/50 blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        </div>

        <section className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-32">
          <div className="mb-24 flex flex-col items-start gap-8 border-b border-slate-100 pb-16 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-indigo-600">
                <Sparkles size={12} />
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">
                  Support & Communication
                </span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter text-slate-950 uppercase italic md:text-8xl">
                CENTRAL DE <br />{" "}
                <span className="text-indigo-600">CONTATO.</span>
              </h1>
            </div>
            <div className="text-left lg:text-right">
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Tempo Médio de Resposta
              </p>
              <p className="text-xl font-bold text-slate-950 uppercase italic">
                &lt; 02 HORAS ÚTEIS
              </p>
            </div>
          </div>

          <div className="grid gap-20 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                      Nome Completo
                    </label>
                    <input
                      {...register("name")}
                      placeholder="Ex: Dario Matias"
                      className={`w-full rounded-2xl border bg-slate-50 px-6 py-4 font-bold text-slate-900 transition-all placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:outline-none ${
                        errors.name
                          ? "border-red-500 focus:ring-red-500/5"
                          : "border-slate-100 focus:border-indigo-600 focus:ring-indigo-600/5"
                      }`}
                    />
                    {errors.name && (
                      <p className="ml-1 text-[10px] font-bold text-red-500 uppercase">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                      E-mail Corporativo
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="seu@email.com"
                      className={`w-full rounded-2xl border bg-slate-50 px-6 py-4 font-bold text-slate-900 transition-all placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:outline-none ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500/5"
                          : "border-slate-100 focus:border-indigo-600 focus:ring-indigo-600/5"
                      }`}
                    />
                    {errors.email && (
                      <p className="ml-1 text-[10px] font-bold text-red-500 uppercase">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                    Assunto
                  </label>
                  <input
                    {...register("subject")}
                    placeholder="Como podemos ajudar sua operação?"
                    className={`w-full rounded-2xl border bg-slate-50 px-6 py-4 font-bold text-slate-900 transition-all placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:outline-none ${
                      errors.subject
                        ? "border-red-500 focus:ring-red-500/5"
                        : "border-slate-100 focus:border-indigo-600 focus:ring-indigo-600/5"
                    }`}
                  />
                  {errors.subject && (
                    <p className="ml-1 text-[10px] font-bold text-red-500 uppercase">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                    Mensagem
                  </label>
                  <textarea
                    {...register("message")}
                    rows={6}
                    placeholder="Descreva detalhadamente sua necessidade técnica ou comercial..."
                    className={`w-full resize-none rounded-3xl border bg-slate-50 px-6 py-4 font-bold text-slate-900 transition-all placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:outline-none ${
                      errors.message
                        ? "border-red-500 focus:ring-red-500/5"
                        : "border-slate-100 focus:border-indigo-600 focus:ring-indigo-600/5"
                    }`}
                  />
                  {errors.message && (
                    <p className="ml-1 text-[10px] font-bold text-red-500 uppercase">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <ActionButton>ENVIAR MENSAGEM</ActionButton>
              </form>
            </div>

            <div className="space-y-12 lg:col-span-5">
              <div className="rounded-[2.5rem] bg-slate-950 p-10 text-white shadow-2xl">
                <h3 className="mb-8 text-2xl font-black tracking-tighter uppercase italic">
                  Canais Oficiais
                </h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                        E-mail de Suporte
                      </p>
                      <p className="text-lg font-bold italic">
                        support@myecommerce.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                        Chat em Tempo Real
                      </p>
                      <p className="text-lg font-bold italic">
                        Disponível no Dashboard
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                        Localização
                      </p>
                      <p className="text-lg font-bold italic">
                        Global HQ — São Paulo, BR
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10">
                <h3 className="mb-6 text-xl font-black tracking-tighter text-slate-950 uppercase italic">
                  Recursos Rápidos
                </h3>
                <div className="space-y-4">
                  {[
                    "Perguntas Frequentes",
                    "Política de Privacidade",
                    "Termos de Uso",
                  ].map((item, i) => (
                    <button
                      key={i}
                      className="group flex w-full items-center justify-between border-b border-slate-50 pb-4 text-left transition-colors hover:border-indigo-100"
                    >
                      <span className="text-sm font-bold tracking-widest text-slate-500 uppercase group-hover:text-indigo-600">
                        {item}
                      </span>
                      <ArrowRight
                        size={16}
                        className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-indigo-600"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-40 overflow-hidden rounded-[3rem] bg-slate-950 p-10 text-white md:p-20">
            <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="mb-6 text-4xl font-black tracking-tighter uppercase italic md:text-6xl">
                  NOSSO <span className="text-indigo-500">COMPROMISSO.</span>
                </h2>
                <p className="mb-10 text-xl leading-relaxed text-slate-400 italic">
                  A transparência é o core da nossa engenharia. Suas
                  solicitações são tratadas sob protocolos de alta prioridade
                  para garantir a continuidade do seu negócio.
                </p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: Globe, text: "Global Coverage" },
                    { icon: ShieldCheck, text: "Secure Handling" },
                    { icon: FileLock, text: "Private Encrypted" },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2"
                    >
                      <item.icon size={14} className="text-indigo-500" />
                      <span className="text-[10px] font-black tracking-widest uppercase">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-white/10 bg-indigo-600/10 md:h-80 md:w-80">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-500/20" />
                  <ShieldCheck
                    size={120}
                    className="relative z-10 text-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ContactPage;
