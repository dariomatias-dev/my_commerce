import { Menu, Store, X } from "lucide-react";
import { useEffect, useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-white/80 py-4 shadow-sm backdrop-blur-xl"
            : "bg-transparent py-8"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="group flex cursor-pointer items-center gap-2">
            <div className="rounded-xl bg-slate-950 p-2 transition-transform group-hover:rotate-12">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">
              My<span className="text-indigo-600">Ecommerce</span>
            </span>
          </div>

          <div className="hidden items-center gap-10 lg:flex">
            {["Funcionalidades", "Planos", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-xs font-black tracking-widest text-slate-400 uppercase transition-colors hover:text-indigo-600"
              >
                {item}
              </a>
            ))}
            <button className="rounded-full bg-slate-950 px-8 py-3 text-xs font-black tracking-widest text-white uppercase shadow-2xl shadow-slate-200 transition-all hover:bg-indigo-600 active:scale-95">
              Criar Loja Free
            </button>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
    </header>
  );
};
