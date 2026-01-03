"use client";

import { createContext, ReactNode, useContext } from "react";

import { StoreResponse } from "@/@types/store/store-response";

interface StoreContextData {
  store: StoreResponse;
}

const StoreContext = createContext<StoreContextData>({} as StoreContextData);

export const StoreProvider = ({
  children,
  store,
}: {
  children: ReactNode;
  store: StoreResponse;
}) => {
  return (
    <StoreContext.Provider value={{ store }}>{children}</StoreContext.Provider>
  );
};

export const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStoreContext must be used within a StoreProvider");
  }

  return context;
};
