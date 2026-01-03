"use client";

import { AlertCircle, Loader2, ShoppingBag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { CartStorage } from "@/@types/cart-storage";
import { StoreResponse } from "@/@types/store/store-response";
import { ActionButton } from "@/components/buttons/action-button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useProduct } from "@/services/hooks/use-product";
import { Item, StoreCartItem } from "./store-cart-item";

interface StoreCartProps {
  store: StoreResponse;
}

export const StoreCart = ({ store }: StoreCartProps) => {
  const router = useRouter();
  const { getProductsByIds } = useProduct();

  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const storageKey = `cart-${store.id}`;

  const getStorageCart = useCallback((): CartStorage[] => {
    if (typeof window === "undefined") return [];

    const stored = localStorage.getItem(storageKey);

    return stored ? JSON.parse(stored) : [];
  }, [storageKey]);

  const syncBadgeCount = useCallback(() => {
    const storageCart = getStorageCart();

    setCartCount(storageCart.length);
  }, [getStorageCart]);

  const updateStorage = (updatedItems: Item[]) => {
    const storageData: CartStorage[] = updatedItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    localStorage.setItem(storageKey, JSON.stringify(storageData));

    syncBadgeCount();

    window.dispatchEvent(new Event("cart-updated"));
  };

  const fetchCartData = useCallback(async () => {
    const storageCart = getStorageCart();
    if (storageCart.length === 0) {
      setItems([]);

      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const productIds = storageCart.map((i) => i.id);
      const response = await getProductsByIds(store.id, productIds);

      const products = response.content || [];

      const mergedItems: Item[] = products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url,
        quantity: storageCart.find((i) => i.id === product.id)?.quantity || 1,
      }));

      setItems(mergedItems);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Erro ao carregar os itens do carrinho.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [store.id, getProductsByIds, getStorageCart]);

  useEffect(() => {
    syncBadgeCount();

    window.addEventListener("cart-updated", syncBadgeCount);

    return () => window.removeEventListener("cart-updated", syncBadgeCount);
  }, [syncBadgeCount]);

  useEffect(() => {
    if (isOpen) fetchCartData();
  }, [isOpen, fetchCartData]);

  const handleIncrease = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );

    setItems(updated);
    updateStorage(updated);
  };

  const handleDecrease = (id: string) => {
    const updated = items.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );

    setItems(updated);
    updateStorage(updated);
  };

  const handleRemove = (id: string) => {
    const updated = items.filter((item) => item.id !== id);

    setItems(updated);
    updateStorage(updated);
  };

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <Sheet onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="group relative flex h-10 items-center gap-4 rounded-xl bg-slate-950 px-8 text-white transition-all hover:bg-indigo-600 active:scale-95 border-2 border-transparent outline-none">
          <ShoppingBag size={20} />

          <span className="text-xs font-black tracking-[0.2em] uppercase italic">
            Carrinho
          </span>

          {cartCount > 0 && (
            <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-black shadow-lg ring-4 ring-white transition-all group-hover:ring-indigo-50">
              {cartCount}
            </div>
          )}
        </button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md border-l-0 shadow-2xl transition-all duration-500 ease-in-out">
        <div className="flex items-center justify-between py-6 px-8 pb-8 border-b border-slate-50">
          <div className="flex flex-col">
            <SheetTitle className="text-2xl font-black uppercase italic tracking-tighter">
              Meu <span className="text-indigo-600">Carrinho</span>
            </SheetTitle>

            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {cartCount} Itens totais
            </span>
          </div>

          <SheetClose className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-950 transition-all outline-none">
            <X size={20} />
          </SheetClose>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-4">
          {isLoading ? (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />

              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Carregando...
              </p>
            </div>
          ) : errorMessage ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <AlertCircle size={32} className="text-red-500" />

              <p className="text-sm font-bold text-slate-600 px-4">
                {errorMessage}
              </p>

              <button
                onClick={fetchCartData}
                className="text-xs font-black uppercase underline text-indigo-600"
              >
                Tentar novamente
              </button>
            </div>
          ) : items.length > 0 ? (
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

          <SheetClose className="w-full" asChild>
            <ActionButton
              onClick={() => router.push(`/store/${store.slug}/checkout`)}
              variant="primary"
              size="lg"
              showArrow
              disabled={items.length === 0 || isLoading}
            >
              Fechar pedido
            </ActionButton>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};
