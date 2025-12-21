import { AxiosRequestConfig, AxiosResponse } from "axios";
import { useCallback } from "react";

import { api } from "@/lib/axios";

export const useApi = () => {
  const request = useCallback(
    async <T>(config: AxiosRequestConfig): Promise<T> => {
      const response: AxiosResponse<T> = await api.request<T>(config);
      return response.data;
    },
    [],
  );

  const get = useCallback(
    <T>(url: string, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: "GET", url }),
    [request],
  );

  const post = useCallback(
    <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: "POST", url, data }),
    [request],
  );

  const put = useCallback(
    <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: "PUT", url, data }),
    [request],
  );

  const patch = useCallback(
    <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: "PATCH", url, data }),
    [request],
  );

  const del = useCallback(
    <T>(url: string, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: "DELETE", url }),
    [request],
  );

  return { get, post, put, patch, delete: del };
};
