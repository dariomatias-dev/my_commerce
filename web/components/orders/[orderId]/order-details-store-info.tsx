import { Store } from "lucide-react";

import { StoreResponse } from "@/@types/store/store-response";

interface OrderDetailsStoreInfoProps {
  store: StoreResponse;
}

export const OrderDetailsStoreInfo = ({
  store,
}: OrderDetailsStoreInfoProps) => {
  return (
    <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg"
          style={{ backgroundColor: store.themeColor || "#4f46e5" }}
        >
          <Store size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Unidade Comercial
          </p>
          <h3 className="text-lg font-black uppercase italic tracking-tighter text-slate-950">
            {store.name}
          </h3>
        </div>
      </div>

      <p className="mb-6 text-sm leading-relaxed text-slate-500">
        {store.description || "Nenhuma descrição fornecida para esta unidade."}
      </p>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Status
          </span>
          <span
            className={`text-[10px] font-black uppercase ${
              store.isActive ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {store.isActive ? "Operacional" : "Offline"}
          </span>
        </div>
      </div>
    </div>
  );
};
