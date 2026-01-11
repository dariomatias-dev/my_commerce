"use client";

import { Check, ChevronDown, LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DropdownOption {
  id: string;
  name: string;
}

interface DropdownProps {
  label?: string;
  icon?: LucideIcon;
  options: DropdownOption[];
  value?: string;
  onChange: (id: string) => void;
  placeholder?: string;
  className?: string;
}

export const Dropdown = ({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  placeholder = "— Selecionar —",
  className,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (id: string) => {
    onChange(id);
    setIsOpen(false);
  };

  return (
    <div className={`space-y-2 ${className}`} ref={containerRef}>
      {label && (
        <label className="ml-1 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase flex items-center gap-2">
          {Icon && <Icon size={12} className="text-indigo-600" />}
          {label}
        </label>
      )}

      <div className="relative group">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between rounded-2xl border-2 py-4.5 px-6 
            text-[11px] font-black uppercase italic tracking-wider
            outline-none transition-all duration-300 cursor-pointer
            ${
              isOpen
                ? "border-indigo-600 bg-white shadow-lg"
                : "border-slate-100 bg-slate-50 hover:border-slate-300"
            }
          `}
        >
          <span
            className={selectedOption ? "text-slate-950" : "text-slate-400"}
          >
            {selectedOption ? selectedOption.name : placeholder}
          </span>

          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180 text-indigo-600" : "text-slate-400"
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-3 z-50 overflow-hidden rounded-[2rem] border-2 border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="max-h-60 overflow-y-auto pr-1">
              {options.length > 0 ? (
                options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt.id)}
                    className={`
                      w-full flex items-center justify-between rounded-xl px-5 py-4
                      text-[10px] font-black uppercase italic tracking-widest transition-all cursor-pointer
                      ${
                        value === opt.id
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                          : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                      }
                    `}
                  >
                    {opt.name}

                    {value === opt.id && (
                      <Check
                        size={14}
                        strokeWidth={4}
                        className="animate-in zoom-in duration-300"
                      />
                    )}
                  </button>
                ))
              ) : (
                <div className="py-10 text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 italic">
                    Nenhum registro localizado
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div
          className={`
          absolute bottom-0 left-6 right-6 h-0.5 transition-all duration-500 scale-x-0 group-focus-within:scale-x-100 bg-indigo-600
          ${isOpen ? "scale-x-100" : ""}
        `}
        />
      </div>
    </div>
  );
};
