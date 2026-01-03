export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  PIX = "PIX",
  BOLETO = "BOLETO",
  CASH = "CASH",
}

interface PaymentOptionProps {
  method: PaymentMethod;
  currentMethod: PaymentMethod;
  icon: React.ReactNode;
  label: string;
  description: string;
  onSelect: (method: PaymentMethod) => void;
}

export const PaymentOption = ({
  method,
  currentMethod,
  icon,
  label,
  description,
  onSelect,
}: PaymentOptionProps) => {
  const isSelected = currentMethod === method;
  return (
    <button
      onClick={() => onSelect(method)}
      className={`flex items-center gap-4 rounded-2xl border-2 p-6 transition-all text-left ${
        isSelected
          ? "border-indigo-600 bg-indigo-50/30"
          : "border-slate-50 bg-slate-50 hover:border-slate-200"
      }`}
    >
      <div className={isSelected ? "text-indigo-600" : "text-slate-400"}>
        {icon}
      </div>

      <div>
        <p className="text-sm font-black uppercase italic leading-none text-slate-950">
          {label}
        </p>

        <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase">
          {description}
        </p>
      </div>
    </button>
  );
};
