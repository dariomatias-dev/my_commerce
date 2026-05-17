import { MapPin, Truck } from "lucide-react";

import { OrderAddressResponse } from "@/@types/order/order-address-response";
import { FreightType } from "@/enums/freight-type";

interface OrderDetailsLogisticsInfoProps {
  type: FreightType;
  address: OrderAddressResponse;
}

export const OrderDetailsLogisticsInfo = ({ type, address }: OrderDetailsLogisticsInfoProps) => {
  return (
    <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Truck size={28} />
      </div>

      <h3 className="mb-6 text-sm font-black tracking-widest text-slate-950 uppercase">
        Logística de Entrega
      </h3>

      <div className="space-y-6">
        <div>
          <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
            Modalidade
          </p>

          <p className="text-sm font-bold text-slate-900">
            {type === FreightType.ECONOMICAL ? "Frete Econômico" : "Frete Expresso"}
          </p>
        </div>

        <div className="border-t border-slate-50 pt-4">
          <p className="mb-3 text-[9px] font-black tracking-widest text-slate-400 uppercase">
            Endereço de Destino
          </p>

          <div className="flex items-start gap-3">
            <MapPin size={18} className="mt-0.5 shrink-0 text-indigo-600" />

            <div className="text-xs leading-relaxed font-medium text-slate-600">
              <strong className="mb-1 block text-sm text-slate-900">{address.label}</strong>
              {address.street}, {address.number} {address.complement && `(${address.complement})`}{" "}
              <br />
              {address.neighborhood} — {address.city}, {address.state} <br />
              <span className="mt-1 block font-bold tracking-widest text-indigo-600">
                CEP {address.zip}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
