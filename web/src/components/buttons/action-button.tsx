import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode } from "react";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "dark";
  size?: "lg" | "sm";
  showArrow?: boolean;
  children: ReactNode;
};

export const ActionButton = ({
  variant = "primary",
  size = "lg",
  className,
  showArrow = false,
  children,
  ...props
}: ActionButtonProps) => {
  const isPrimary = variant === "primary";
  const isLarge = size === "lg";

  return (
    <button
      {...props}
      className={clsx(
        "group relative w-full overflow-hidden rounded-2xl font-black text-white transition-all active:scale-95",
        isLarge ? "py-5 text-lg shadow-xl" : "py-4 text-xs tracking-widest",
        isPrimary
          ? "bg-indigo-600 hover:bg-indigo-700 hover:shadow-[0_20px_40px_rgba(79,70,229,0.2)]"
          : "bg-slate-950 hover:bg-indigo-600",
        className,
      )}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}

        {showArrow && (
          <ArrowRight
            size={isLarge ? 20 : 16}
            className="transition-transform group-hover:translate-x-1"
          />
        )}
      </span>

      <div
        className={clsx(
          "absolute inset-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0",
          isPrimary ? "bg-slate-950" : "bg-indigo-600",
        )}
      />
    </button>
  );
};
