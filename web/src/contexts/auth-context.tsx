"use client";

import Cookies from "js-cookie";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { UserResponse } from "@/@types/user/user-response";
import { useUser } from "@/hooks/use-user";

interface AuthContextData {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserResponse | null) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getMe } = useUser();

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("refreshToken");
    setUser(null);
    window.location.href = "/login";
  };

  const refreshUser = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setIsLoading(false);

      return;
    }

    try {
      setIsLoading(true);

      const userData = await getMe();

      setUser(userData);
    } catch (error) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        setUser,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
