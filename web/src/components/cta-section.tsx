export const CtaSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-indigo-600 py-40 lg:py-60">
      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
      <div className="absolute -top-[20%] -right-[10%] h-[50%] w-[50%] rounded-full bg-white/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <h2 className="mb-16 text-6xl leading-none font-black tracking-tighter text-white italic md:text-9xl xl:text-[12rem]">
          SEU SUCESSO <br /> NÃO ESPERA.
        </h2>
        <p className="mx-auto mb-20 max-w-4xl text-2xl font-medium tracking-tight text-indigo-100 md:text-4xl">
          Pare de apenas olhar. Comece a vender hoje na plataforma de e-commerce
          que mais cresce no Brasil.
        </p>
        <button className="group shadow-3xl relative overflow-hidden rounded-full bg-white px-20 py-10 text-4xl font-black text-indigo-600 transition-all hover:scale-105 active:scale-95">
          <span className="relative z-10 uppercase">Criar Loja Agora</span>
          <div className="absolute inset-0 translate-y-[100%] bg-slate-950 transition-transform duration-300 group-hover:translate-y-0" />
          <span className="absolute inset-0 z-20 flex translate-y-[100%] items-center justify-center font-black text-white uppercase transition-transform duration-300 group-hover:translate-y-0">
            Comece grátis
          </span>
        </button>
        <div className="mt-16 text-sm font-black tracking-[0.5em] text-indigo-200 uppercase italic opacity-60">
          Não é necessário cartão de crédito • Comece em 2 minutos
        </div>
      </div>
    </section>
  );
};
