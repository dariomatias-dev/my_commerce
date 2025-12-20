import { ArrowRight, Sparkles } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="mb-12 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-6 py-2">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span className="text-[10px] font-black tracking-[0.3em] text-indigo-700 uppercase">
            Seu império começa hoje
          </span>
        </div>

        <h1 className="mb-12 text-7xl leading-[0.85] font-black tracking-tighter text-slate-950 md:text-9xl lg:text-[180px] xl:text-[220px]">
          CONSTRUA. <br />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 bg-clip-text text-transparent italic">
            VENDA.
          </span>
        </h1>

        <p className="mx-auto mb-16 max-w-3xl text-xl leading-relaxed font-medium tracking-tight text-slate-500 md:text-3xl">
          A infraestrutura definitiva para e-commerce.
          <br className="hidden md:block" />
          Venda em minutos, escale para milhões.
        </p>

        <div className="flex flex-col items-center justify-center gap-8 sm:flex-row">
          <button className="group flex items-center justify-center gap-4 rounded-full bg-indigo-600 px-14 py-8 text-2xl font-black text-white shadow-[0_25px_60px_-15px_rgba(79,70,229,0.4)] transition-all hover:bg-indigo-700 active:scale-95">
            Começar Agora <ArrowRight size={28} />
          </button>

          <div className="flex items-center -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-12 w-12 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-sm"
              >
                <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="User" />
              </div>
            ))}
            <span className="pl-6 text-sm font-bold tracking-widest text-slate-400 uppercase">
              +15k Lojistas
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
