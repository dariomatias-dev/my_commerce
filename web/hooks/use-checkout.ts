"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { UserAddressResponse } from "@/@types/address/user-address-response";
import { ApiError } from "@/@types/api";
import { CartStorage } from "@/@types/cart-storage";
import {
  FreightOption,
  FreightResponse,
} from "@/@types/freight/freight-response";
import { OrderRequest } from "@/@types/order/order-request";
import { StoreResponse } from "@/@types/store/store-response";
import { Item } from "@/components/layout/store-header/store-cart/store-cart-item";
import { PaymentMethod } from "@/enums/payment-method";
import { AddressFormValues } from "@/schemas/address.schema";
import { useFreight } from "@/services/hooks/use-freight";
import { useOrder } from "@/services/hooks/use-order";
import { useProduct } from "@/services/hooks/use-product";
import { useStore } from "@/services/hooks/use-store";
import { useUserAddress } from "@/services/hooks/use-user-address";

export const useCheckout = () => {
  const router = useRouter();
  const params = useParams();
  const { getProductsByIds } = useProduct();
  const { getStoreBySlug } = useStore();
  const { createOrder } = useOrder();
  const { getAllAddresses, createAddress } = useUserAddress();
  const { calculateFreight } = useFreight();

  const [store, setStore] = useState<StoreResponse | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [addresses, setAddresses] = useState<UserAddressResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.PIX
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  const [freightOptions, setFreightOptions] = useState<FreightResponse | null>(
    null
  );
  const [selectedFreight, setSelectedFreight] = useState<FreightOption | null>(
    null
  );
  const [isFreightLoading, setIsFreightLoading] = useState(false);

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
      const [storeResponse, addressesResponse] = await Promise.all([
        getStoreBySlug(slug),
        getAllAddresses(),
      ]);

      setStore(storeResponse);
      setAddresses(addressesResponse);

      if (addressesResponse.length > 0 && !selectedAddressId) {
        setSelectedAddressId(addressesResponse[0].id);
      }

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
        image: product.images?.[0]?.url,
        quantity:
          storageCart.find((i: CartStorage) => i.id === product.id)?.quantity ||
          1,
      }));

      setItems(mergedItems);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro ao carregar dados do checkout.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [
    slug,
    getStoreBySlug,
    getProductsByIds,
    getAllAddresses,
    router,
    selectedAddressId,
  ]);

  useEffect(() => {
    fetchCheckoutData();
  }, [fetchCheckoutData]);

  useEffect(() => {
    const fetchFreight = async () => {
      if (!selectedAddressId) return;

      try {
        setIsFreightLoading(true);

        const response = await calculateFreight(selectedAddressId);

        setFreightOptions(response);
        setSelectedFreight(response.economical);
      } catch (error) {
        console.error(error);
      } finally {
        setIsFreightLoading(false);
      }
    };

    fetchFreight();
  }, [selectedAddressId, calculateFreight]);

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

  const handleCreateAddress = async (formData: AddressFormValues) => {
    try {
      const requestData = {
        label: "Endereço de Entrega",
        street: formData.street,
        number: formData.number,
        complement: formData.complement || "",
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        zip: formData.cep,
        latitude: formData.latitude ? Number(formData.latitude) : 0,
        longitude: formData.longitude ? Number(formData.longitude) : 0,
      };
      const newAddress = await createAddress(requestData);

      setAddresses((prev) => [newAddress, ...prev]);
      setSelectedAddressId(newAddress.id);
    } catch (error) {
      throw error;
    }
  };

  const handleFinishOrder = async () => {
    if (!store || items.length === 0) return;

    if (!selectedAddressId || !selectedFreight) {
      setErrorMessage("Selecione o endereço e o método de envio.");

      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const orderPayload: OrderRequest = {
        storeId: store.id,
        addressId: selectedAddressId,
        paymentMethod,
        freightType: selectedFreight.type,
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
        setErrorMessage("Erro ao processar pedido.");
      }

      setIsSubmitting(false);
    }
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const freightValue = selectedFreight?.value || 0;
  const total = subtotal + freightValue;

  return {
    items,
    addresses,
    isLoading,
    errorMessage,
    isSubmitting,
    paymentMethod,
    setPaymentMethod,
    selectedAddressId,
    setSelectedAddressId,
    freightOptions,
    selectedFreight,
    setSelectedFreight,
    isFreightLoading,
    subtotal,
    freightValue,
    total,
    fetchCheckoutData,
    handleQuantity,
    handleRemove,
    handleCreateAddress,
    handleFinishOrder,
    router,
  };
};
