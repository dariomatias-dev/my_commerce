"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export const FaqsSection = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Como funciona a migração de outra plataforma?",
      a: "Nossa equipe cuida de tudo. Importamos seus produtos, clientes e histórico de pedidos em menos de 24h sem tirar sua loja do ar.",
    },
    {
      q: "Quais as formas de pagamento aceitas?",
      a: "Integração nativa com Pix, principais cartões de crédito e boleto. Taxas exclusivas já negociadas para nossos parceiros.",
    },
    {
      q: "Posso vender em marketplaces como Amazon e Magalu?",
      a: "Sim! O MyEcommerce centraliza seu estoque e pedidos de múltiplos canais em um único painel inteligente.",
    },
    {
      q: "Existe limite de visitas ou tráfego?",
      a: "Nenhum. Nossa infraestrutura escala automaticamente para aguentar desde o primeiro acesso até o Black Friday.",
    },
  ];

  return (
    <section className="py-40" id="faq">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-24 text-center">
          <h2 className="mb-4 text-4xl font-black tracking-tighter uppercase italic">
            Perguntas Frequentes
          </h2>
          <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            Tudo o que você precisa saber
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-3xl border border-slate-100 bg-white transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-10 py-8 text-left transition-colors hover:bg-slate-50"
              >
                <span className="text-lg font-black tracking-tight">
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    "transition-transform duration-300",
                    openFaq === i
                      ? "rotate-180 text-indigo-600"
                      : "text-slate-300",
                  )}
                />
              </button>

              <div
                className={cn(
                  "overflow-hidden px-10 text-lg leading-relaxed font-medium text-slate-500 transition-all duration-500",
                  openFaq === i ? "max-h-[200px] pb-10" : "max-h-0 pb-0",
                )}
              >
                <div className="mt-2">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
