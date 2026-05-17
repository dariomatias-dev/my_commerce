import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

import { ApiError, ApiResponse } from "@/@types/api";
import { api, internalApi } from "@/lib/axios";

const createClient = (instance: AxiosInstance) => {
  const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
    try {
      const response: AxiosResponse<ApiResponse<T>> =
        await instance.request<ApiResponse<T>>(config);

      const apiResponse = response.data;

      if (apiResponse.status === "error") {
        throw new ApiError(
          apiResponse.message,
          apiResponse.code,
          apiResponse.errors,
        );
      }

      return apiResponse.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof AxiosError && error.response) {
        const apiData = error.response.data as ApiResponse<null>;

        throw new ApiError(
          apiData.message || "Erro na requisição",
          apiData.code || error.response.status,
          apiData.errors,
        );
      }

      throw new ApiError("Erro de conexão com o servidor", 500);
    }
  };

  return {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: "GET", url }),

    post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: "POST", url, data }),

    put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: "PUT", url, data }),

    patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: "PATCH", url, data }),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: "DELETE", url }),
  };
};

export const apiClient = createClient(api);
export const internalApiClient = createClient(internalApi);
