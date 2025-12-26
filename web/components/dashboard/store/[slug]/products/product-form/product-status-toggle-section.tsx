interface ProductStatusToggleSectionProps {
  isActive: boolean;
  onToggle: (value: boolean) => void;
}

export const ProductStatusToggleSection = ({ isActive, onToggle }: ProductStatusToggleSectionProps) => (
  <section className="rounded-[2.5rem] border-2 border-slate-200 bg-white p-8 md:p-12 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-black tracking-widest text-slate-950 uppercase">
        Publicação Ativa
      </p>

      <button
        type="button"
        onClick={() => onToggle(!isActive)}
        className={`relative h-8 w-14 rounded-full transition-all ${
          isActive ? "bg-indigo-600" : "bg-slate-200"
        }`}
      >
        <div
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-all ${
            isActive ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  </section>
);
