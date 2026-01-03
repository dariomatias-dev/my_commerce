import { Store } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-slate-50 bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-24 flex flex-col items-start justify-between gap-20 lg:flex-row">
          <div className="max-w-xs">
            <div className="mb-10 flex items-center gap-2">
              <div className="rounded-xl bg-slate-950 p-2">
                <Store className="h-5 w-5 text-white" />
              </div>

              <span className="text-2xl font-black tracking-tighter text-slate-950 uppercase italic">
                MyEcommerce
              </span>
            </div>

            <p className="leading-relaxed font-medium text-slate-400 italic">
              Empoderando empreendedores a alcançarem a liberdade financeira
              através do varejo digital.
            </p>
          </div>

          <div className="flex flex-wrap gap-20 lg:gap-40">
            <div>
              <h4 className="mb-10 text-xs font-black tracking-[0.4em] text-indigo-600 uppercase">
                Produto
              </h4>

              <ul className="space-y-6 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-slate-950"
                  >
                    Sistema
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-slate-950"
                  >
                    Marketplace
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-slate-950"
                  >
                    Segurança
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-10 text-xs font-black tracking-[0.4em] text-indigo-600 uppercase">
                Empresa
              </h4>

              <ul className="space-y-6 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-slate-950"
                  >
                    Suporte
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-slate-950"
                  >
                    Privacidade
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    className="transition-colors hover:text-slate-950"
                  >
                    Contato
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between border-t border-slate-50 pt-10 text-[10px] font-black tracking-[0.5em] text-slate-300 uppercase md:flex-row">
          <p>© 2025 MY ECOMMERCE INC. ALL RIGHTS RESERVED.</p>

          <div className="mt-8 flex gap-10 md:mt-0">
            <a href="#" className="transition-colors hover:text-indigo-600">
              Twitter
            </a>

            <a href="#" className="transition-colors hover:text-indigo-600">
              Instagram
            </a>

            <a href="#" className="transition-colors hover:text-indigo-600">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
