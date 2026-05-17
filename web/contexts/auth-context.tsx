"use client";

import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";

import Cookies from "js-cookie";

import { SubscriptionResponse } from "@/@types/subscription/subscription-response";
import { UserResponse } from "@/@types/user/user-response";
import { getMyActiveSubscription } from "@/services/subscriptions";
import { getMe } from "@/services/users";

interface AuthContextData {
  user: UserResponse | null;
  subscription: SubscriptionResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserResponse | null) => void;
  setSubscription: (subscription: SubscriptionResponse | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");

    setUser(null);
    setSubscription(null);

    window.location.href = "/login";
  };

  const refreshUser = useCallback(async () => {
    const token = Cookies.get("token");
    if (!token) {
      setIsLoading(false);

      return;
    }

    try {
      setIsLoading(true);

      const [userData, subData] = await Promise.all([
        getMe(),
        getMyActiveSubscription().catch(() => null),
      ]);

      setUser(userData);
      setSubscription(subData);
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      const token = Cookies.get("token");

      if (!token) {
        setIsLoading(false);

        return;
      }

      try {
        setIsLoading(true);

        const [userData, subData] = await Promise.all([
          getMe(),
          getMyActiveSubscription().catch(() => null),
        ]);

        if (!ignore) {
          setUser(userData);
          setSubscription(subData);
        }
      } catch {
        if (!ignore) logout();
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadUser();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        subscription,
        isAuthenticated: !!user,
        isLoading,
        setUser,
        setSubscription,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
