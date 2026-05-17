"use client";

import { useEffect, useRef, useState } from "react";

import { Check, ChevronDown, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

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
  buttonClassName?: string;
}

export const Dropdown = ({
  label,
  icon: Icon,
  options,
  value,
  onChange,
  placeholder = "— Selecionar —",
  className,
  buttonClassName,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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
    <div className={cn("space-y-2", className)} ref={containerRef}>
      {label && (
        <label className="ml-1 flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
          {Icon && <Icon size={12} className="text-indigo-600" />}
          {label}
        </label>
      )}

      <div className="group relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full cursor-pointer items-center justify-between rounded-2xl border-2 px-6 py-4.5 text-[11px] font-black tracking-wider uppercase italic transition-all duration-300 outline-none",
            isOpen
              ? "border-indigo-600 bg-white shadow-lg"
              : "border-slate-100 bg-white hover:border-slate-300",
            buttonClassName,
          )}
        >
          <span className={selectedOption ? "text-slate-950" : "text-slate-400"}>
            {selectedOption ? selectedOption.name : placeholder}
          </span>

          <ChevronDown
            size={18}
            className={cn(
              "transition-transform duration-300",
              isOpen ? "rotate-180 text-indigo-600" : "text-slate-400",
            )}
          />
        </button>

        {isOpen && (
          <div className="animate-in fade-in zoom-in-95 absolute top-full right-0 left-0 z-50 mt-3 overflow-hidden rounded-[2rem] border-2 border-slate-200 bg-white p-2 shadow-2xl duration-200">
            <div className="max-h-60 overflow-y-auto pr-1">
              {options.length > 0 ? (
                options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt.id)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between rounded-xl px-5 py-4 text-[10px] font-black tracking-widest uppercase italic transition-all",
                      value === opt.id
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                        : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600",
                    )}
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
                  <p className="text-[9px] font-black tracking-[0.3em] text-slate-300 uppercase italic">
                    Nenhum registro localizado
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div
          className={cn(
            "absolute right-6 bottom-0 left-6 h-0.5 scale-x-0 bg-indigo-600 transition-all duration-500 group-focus-within:scale-x-100",
            isOpen ? "scale-x-100" : "",
          )}
        />
      </div>
    </div>
  );
};
