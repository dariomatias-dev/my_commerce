"use client";

import { ShoppingBag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ActionButton } from "@/components/buttons/action-button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Item, StoreCartItem } from "./store-cart-item";

export const StoreCart = () => {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([
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
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&auto=format&fit=crop&q=60",
    },
  ]);

  const handleIncrease = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleGoToCheckout = () => {
    router.push("/checkout");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="group relative flex h-10 items-center gap-4 rounded-xl bg-slate-950 px-8 text-white transition-all hover:bg-indigo-600 active:scale-95 border-2 border-transparent outline-none">
          <ShoppingBag size={20} />
          <span className="text-xs font-black tracking-[0.2em] uppercase italic">
            Carrinho
          </span>
          <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-black shadow-lg ring-4 ring-white transition-all group-hover:ring-indigo-50">
            {items.length}
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
              {items.length} Itens selecionados
            </span>
          </div>

          <SheetClose className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-950 transition-all outline-none">
            <X size={20} />
          </SheetClose>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4">
          {items.length > 0 ? (
            <div className="flex flex-col gap-8">
              {items.map((item) => (
                <StoreCartItem
                  key={item.id}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                />
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

          <ActionButton
            onClick={handleGoToCheckout}
            variant="primary"
            size="lg"
            showArrow
            disabled={items.length === 0}
          >
            Fechar pedido
          </ActionButton>
        </div>
      </SheetContent>
    </Sheet>
  );
};
