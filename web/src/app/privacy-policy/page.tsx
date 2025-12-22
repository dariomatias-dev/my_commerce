"use client";

import { ArrowUpRight, FileLock, Globe, ShieldCheck } from "lucide-react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function PrivacyPolicyPage() {
  const policyClauses = [
    {
      id: "01",
      title: "Coleta de Metadados e Telemetria de Rede",
      text: "Nossa infraestrutura captura e processa exclusivamente metadados técnicos vitais para a estabilidade, segurança e performance do ecossistema MyEcommerce. Isso inclui, mas não se limita a: endereços de protocolo de internet (IP), agentes de navegação, logs de erro de servidor, identificadores de sessão criptografados e parâmetros de geolocalização técnica para otimização de rotas via Content Delivery Network (CDN). A coleta é realizada sob rigorosos protocolos de monitoramento 24/7 para prevenir acessos não autorizados, injeções de código malicioso e ataques de negação de serviço (DDoS).",
    },
    {
      id: "02",
      title: "Tratamento de Inteligência Comercial e Performance",
      text: "Todos os dados gerados através da sua operação de vendas — incluindo fluxos de faturamento, métricas de conversão e movimentações de inventário — são tratados como propriedade intelectual privada e exclusiva do lojista. O MyEcommerce utiliza essas informações de forma automatizada apenas para fins de redundância em backups globais, aceleração de carregamento de ativos via edge computing e automação de obrigações fiscais. É terminantemente proibida em nossa arquitetura a comercialização, compartilhamento ou exploração de sua base de clientes para fins de publicidade direcionada por terceiros ou treinamento de modelos de inteligência artificial externos.",
    },
    {
      id: "03",
      title: "Soberania do Usuário e Conformidade LGPD",
      text: "Em total alinhamento com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), garantimos ao lojista soberania absoluta sobre suas informações. Através do Console de Operações, o usuário possui controle total para exercer o direito de portabilidade de dados, retificação de registros e expurgo total de bancos de dados. Em caso de encerramento da instância SaaS, o sistema processa a destruição lógica de todos os registros associados em até 30 dias úteis, mantendo exclusivamente o mínimo operacional exigido por legislações fiscais e obrigações tributárias vigentes no território nacional brasileiro.",
    },
    {
      id: "04",
      title: "Segurança de Fluxos e Túneis Transacionais",
      text: "Toda a comunicação estabelecida entre a infraestrutura do MyEcommerce, gateways de pagamento e os compradores finais é blindada por certificados SSL/TLS 1.3. Atuamos estritamente como operadores tecnológicos, garantindo que dados sensíveis de pagamento nunca sejam armazenados de forma legível em nossos servidores de aplicação. A arquitetura multi-tenant isolada impede que dados de uma loja sejam acessados por outras instâncias na rede, garantindo isolamento lógico e físico total da sua operação comercial.",
    },
    {
      id: "05",
      title: "Protocolos de Cookies e Rastreamento Técnico",
      text: "Utilizamos identificadores únicos (cookies) exclusivamente para funcionalidades essenciais do console administrativo e da vitrine de vendas. Estes arquivos servem para manter o estado da sessão, gerenciar carrinhos de compras em tempo real e fornecer autenticação segura. Não permitimos cookies de rastreamento de terceiros que possam comprometer a privacidade do consumidor final ou mapear comportamentos de navegação para fins não operacionais dentro do ambiente MyEcommerce.",
    },
    {
      id: "06",
      title: "Integrações de Terceiros e APIs Externas",
      text: "Ao utilizar integrações externas em sua loja (como apps de logística ou ERPs), o lojista autoriza o intercâmbio de dados necessário para a execução do serviço. O MyEcommerce audita tecnicamente todos os parceiros de ecossistema para garantir que as APIs utilizem padrões de autenticação OAuth2 e sigam diretrizes de segurança compatíveis com nossa política. Contudo, o tratamento de dados realizado por essas ferramentas externas é regido pelos seus respectivos termos de privacidade.",
    },
    {
      id: "07",
      title: "Retenção de Registros para Auditoria",
      text: "Logs de auditoria e históricos de acesso técnico são retidos por um período cíclico para garantir a rastreabilidade em casos de incidentes de segurança. Esses registros são acessíveis apenas por engenheiros de infraestrutura autorizados e são submetidos a processos de rotação automática. O MyEcommerce reserva-se o direito de manter cópias de segurança criptografadas em servidores geograficamente distribuídos para garantir a continuidade do negócio e a recuperação de desastres (Disaster Recovery) em cenários críticos.",
    },
    {
      id: "08",
      title: "Atualizações do Protocolo de Segurança",
      text: "Dada a evolução constante das ameaças digitais e das regulamentações de dados, esta política pode sofrer atualizações técnicas. Todas as modificações que impactem a forma como os dados são processados serão notificadas através do console de operações e via e-mail corporativo cadastrado. A continuidade do uso da plataforma após tais notificações constitui o aceite dos novos protocolos de governança de dados.",
    },
  ];

  return (
    <>
      <Header />

      <main className="relative min-h-screen bg-white font-sans text-slate-900 pt-12">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-indigo-50/50 blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-slate-100/50 blur-[100px]" />
        </div>

        <section className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-32">
          <div className="mb-24 flex flex-col items-start gap-8 border-b border-slate-100 pb-16 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-6 flex items-center gap-2">
                <span className="text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase">
                  Protocolo de Privacidade e Proteção de Dados
                </span>
              </div>
              <h1 className="text-6xl font-black tracking-tighter text-slate-950 uppercase italic md:text-8xl">
                POLÍTICA DE <br />{" "}
                <span className="text-indigo-600">PRIVACIDADE.</span>
              </h1>
            </div>
            <div className="text-left lg:text-right">
              <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                Última Revisão Técnica
              </p>
              <p className="text-xl font-bold text-slate-950 uppercase italic">
                22 DE DEZEMBRO, 2025
              </p>
            </div>
          </div>

          <div className="mb-32 max-w-4xl space-y-16 text-slate-600">
            {policyClauses.map((clause) => (
              <div key={clause.id} className="space-y-6">
                <h2 className="text-2xl font-black tracking-tighter text-slate-950 uppercase italic">
                  {clause.id}. {clause.title}
                </h2>
                <p className="text-lg leading-relaxed font-medium italic">
                  {clause.text}
                </p>
              </div>
            ))}
          </div>

          <div className="relative overflow-hidden rounded-[3rem] bg-slate-950 p-10 text-white md:p-20">
            <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="mb-6 text-4xl font-black tracking-tighter uppercase italic md:text-6xl">
                  NOSSO <span className="text-indigo-500">COMPROMISSO.</span>
                </h2>
                <p className="mb-10 text-xl leading-relaxed text-slate-400 italic">
                  A transparência é o core da nossa engenharia. Seus dados nunca
                  serão vendidos ou compartilhados para fins de monetização de
                  terceiros.
                </p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { icon: Globe, text: "LGPD Compliance" },
                    { icon: ShieldCheck, text: "End-to-End Encryption" },
                    { icon: FileLock, text: "Data Sovereignty" },
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

          <div className="mt-20 flex flex-col items-center justify-between gap-8 border-t border-slate-100 pt-12 md:flex-row">
            <p className="text-sm font-bold text-slate-400 italic">
              Dúvidas sobre proteção de dados? Entre em contato com nosso DPO.
            </p>
            <a
              href="mailto:legal@myecommerce.com"
              className="group flex items-center gap-3 rounded-2xl bg-slate-100 px-8 py-4 text-xs font-black tracking-widest text-slate-950 uppercase transition-all hover:bg-indigo-600 hover:text-white"
            >
              legal@myecommerce.com
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
