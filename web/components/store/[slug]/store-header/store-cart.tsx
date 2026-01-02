"use client";

import { ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MOCK_CART_ITEMS = [
  {
    id: "1",
    name: "Camiseta Oversized Minimalist",
    price: 129.9,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "2",
    name: "Calça Cargo Streetwear",
    price: 249.9,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&auto=format&fit=crop&q=60",
  },
];

export const StoreCart = () => {
  const total = MOCK_CART_ITEMS.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="group relative flex h-10 items-center gap-4 rounded-xl bg-slate-950 px-8 text-white transition-all hover:bg-indigo-600 active:scale-95 border-2 border-transparent outline-none">
          <ShoppingBag size={20} />
          <span className="text-xs font-black tracking-[0.2em] uppercase italic">
            Carrinho
          </span>
          <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-black shadow-lg ring-4 ring-white transition-all group-hover:ring-indigo-50">
            {MOCK_CART_ITEMS.length}
          </div>
        </button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md border-l-0 shadow-2xl transition-all duration-500 ease-in-out">
        <div className="flex items-center justify-between py-6 px-8 pb-8 border-b border-slate-50">
          <div className="flex flex-col">
            <SheetTitle className="text-2xl font-black uppercase italic tracking-tighter">
              Meu <span className="text-indigo-600">Carrinho</span>
            </SheetTitle>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {MOCK_CART_ITEMS.length} Itens selecionados
            </span>
          </div>

          <SheetClose className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-950 transition-all outline-none">
            <X size={20} />
          </SheetClose>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4">
          {MOCK_CART_ITEMS.length > 0 ? (
            <div className="flex flex-col gap-8">
              {MOCK_CART_ITEMS.map((item) => (
                <div key={item.id} className="group flex gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-1">
                    <h4 className="text-sm font-black uppercase italic leading-tight text-slate-950">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-black text-indigo-600">
                        {item.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        x{item.quantity}
                      </span>
                    </div>
                  </div>
                  <button className="flex h-10 w-10 items-center justify-center self-center rounded-xl text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                <ShoppingBag size={32} className="text-slate-200" />
              </div>
              <p className="text-sm font-black uppercase italic text-slate-400">
                Seu carrinho está vazio
              </p>
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-slate-100">
          <div className="mb-6 flex items-end justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
              Total do Pedido
            </span>
            <span className="text-3xl font-black text-slate-950 tracking-tighter">
              {total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
          <button className="w-full rounded-2xl bg-indigo-600 py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95">
            Finalizar Compra
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
