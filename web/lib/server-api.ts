import { cookies } from "next/headers";

const getApiUrl = () => process.env.API_URL ?? "";

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return token ? { Authorization: `Bearer ${token}` } : {};
};

const baseHeaders = { "Content-Type": "application/json" };

export const serverApi = {
  async get(path: string, params?: Record<string, string>) {
    const url = new URL(`${getApiUrl()}${path}`);

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "") url.searchParams.set(k, v);
      });
    }

    return fetch(url.toString(), {
      headers: { ...baseHeaders, ...(await getAuthHeaders()) },
    });
  },

  async post(path: string, body?: unknown) {
    return fetch(`${getApiUrl()}${path}`, {
      method: "POST",
      headers: { ...baseHeaders, ...(await getAuthHeaders()) },
      body: JSON.stringify(body),
    });
  },

  async patch(path: string, body?: unknown) {
    return fetch(`${getApiUrl()}${path}`, {
      method: "PATCH",
      headers: { ...baseHeaders, ...(await getAuthHeaders()) },
      body: JSON.stringify(body),
    });
  },

  async delete(path: string) {
    return fetch(`${getApiUrl()}${path}`, {
      method: "DELETE",
      headers: { ...baseHeaders, ...(await getAuthHeaders()) },
    });
  },

  async postFormData(path: string, formData: FormData) {
    return fetch(`${getApiUrl()}${path}`, {
      method: "POST",
      headers: { ...(await getAuthHeaders()) },
      body: formData,
    });
  },

  async patchFormData(path: string, formData: FormData) {
    return fetch(`${getApiUrl()}${path}`, {
      method: "PATCH",
      headers: { ...(await getAuthHeaders()) },
      body: formData,
    });
  },
};
