"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/@types/api";
import { CartStorage } from "@/@types/cart-storage";
import { OrderRequest } from "@/@types/order/order-request";
import { StoreResponse } from "@/@types/store/store-response";
import { MOCK_ADDRESSES } from "@/components/store/[slug]/checkout/checkout-address-section/checkout-address-card";
import { Item } from "@/components/store/[slug]/store-header/store-cart/store-cart-item";
import { PaymentMethod } from "@/enums/payment-method";
import { useOrder } from "@/services/hooks/use-order";
import { useProduct } from "@/services/hooks/use-product";
import { useStore } from "@/services/hooks/use-store";

export const useCheckout = () => {
  const router = useRouter();
  const params = useParams();
  const { getProductsByIds } = useProduct();
  const { getStoreBySlug } = useStore();
  const { createOrder } = useOrder();

  const [store, setStore] = useState<StoreResponse | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.PIX
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    MOCK_ADDRESSES[0].id
  );

  const slug = params.slug as string;

  const updateCartStorage = useCallback(
    (storeId: string, updatedItems: Item[]) => {
      const storageKey = `cart-${storeId}`;
      const storageData = updatedItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      localStorage.setItem(storageKey, JSON.stringify(storageData));
      window.dispatchEvent(new Event("cart-updated"));
    },
    []
  );

  const fetchCheckoutData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const storeResponse = await getStoreBySlug(slug);

      setStore(storeResponse);

      const storageKey = `cart-${storeResponse.id}`;
      const stored = localStorage.getItem(storageKey);
      const storageCart = stored ? JSON.parse(stored) : [];

      if (storageCart.length === 0) {
        router.push(`/store/${slug}`);

        return;
      }

      const productIds = storageCart.map((i: CartStorage) => i.id);
      const response = await getProductsByIds(storeResponse.id, productIds);
      const products = response.content || [];

      const mergedItems: Item[] = products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: `${process.env.NEXT_PUBLIC_API_URL}/files/stores/${product.images?.[0]?.url}`,
        quantity:
          storageCart.find((i: CartStorage) => i.id === product.id)?.quantity ||
          1,
      }));

      setItems(mergedItems);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : "Erro ao carregar dados."
      );
    } finally {
      setIsLoading(false);
    }
  }, [slug, getStoreBySlug, getProductsByIds, router]);

  useEffect(() => {
    fetchCheckoutData();
  }, [fetchCheckoutData]);

  const handleQuantity = (id: string, delta: number) => {
    if (!store) return;

    const updated = items.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );

    setItems(updated);
    updateCartStorage(store.id, updated);
  };

  const handleRemove = (id: string) => {
    if (!store) return;

    const updated = items.filter((item) => item.id !== id);

    setItems(updated);
    updateCartStorage(store.id, updated);

    if (updated.length === 0) router.push(`/store/${slug}`);
  };

  const handleFinishOrder = async () => {
    if (!store || items.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const orderPayload: OrderRequest = {
        storeId: store.id,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const result = await createOrder(orderPayload);

      localStorage.removeItem(`cart-${store.id}`);

      window.dispatchEvent(new Event("cart-updated"));

      router.push(`/store/${slug}/success?orderId=${result.id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(
          "Não foi possível processar seu pedido. Tente novamente."
        );
      }

      setIsSubmitting(false);
    }
  };

  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return {
    items,
    isLoading,
    errorMessage,
    isSubmitting,
    paymentMethod,
    setPaymentMethod,
    selectedAddressId,
    setSelectedAddressId,
    total,
    handleQuantity,
    handleRemove,
    handleFinishOrder,
    router,
  };
};
