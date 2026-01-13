"use client";

import { StoreResponse } from "@/@types/store/store-response";
import { StoreCardInfo } from "./store-card-info";
import { StoreCardActions } from "./store-card-actions";

export interface StoreCardProps {
  store: StoreResponse;
  onDelete?: (id: string) => void;
}

export const StoreCard = ({ store, onDelete }: StoreCardProps) => {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[3rem] border border-slate-100 bg-white p-10 shadow-sm transition-all hover:shadow-2xl hover:shadow-slate-200/50">
      <StoreCardInfo store={store} />

      <StoreCardActions store={store} onDelete={onDelete} />
    </div>
  );
};
