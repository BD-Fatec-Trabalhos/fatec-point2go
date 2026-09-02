import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const ACCESS_KEY = "p2g:access";
const REFRESH_KEY = "p2g:refresh";
const EMAIL_KEY = "p2g:email";

export function saveSession(access: string, refresh: string, email: string) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
  localStorage.setItem(EMAIL_KEY, email);
}

export function saveAccessToken(access: string) {
  localStorage.setItem(ACCESS_KEY, access);
}

export function clearSession() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function getStoredEmail() {
  return localStorage.getItem(EMAIL_KEY);
}

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing: Promise<string> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthRoute = typeof original?.url === "string" && original.url.startsWith("/auth/");

    if (error.response?.status === 401 && !original._retry && !isAuthRoute) {
      original._retry = true;
      const refresh = getRefreshToken();
      if (!refresh) {
        clearSession();
        window.location.assign("/login");
        return Promise.reject(error);
      }

      try {
        refreshing ??= api
          .post("/auth/login/refresh", { refresh })
          .then((r) => {
            saveAccessToken(r.data.access);
            return r.data.access as string;
          })
          .finally(() => {
            refreshing = null;
          });

        const newAccess = await refreshing;
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (refreshError) {
        clearSession();
        window.location.assign("/login");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
