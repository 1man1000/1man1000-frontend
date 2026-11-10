import axios from "axios";
import { useAuthStore } from "@/lib/auth-store";

export const api = axios;

function forceLogout() {
  if (typeof window === "undefined") return;
  useAuthStore.getState().logout();
  if (!window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
}

export function initializeApi() {
  // Set base URL for all axios requests
  axios.defaults.baseURL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:6004";

  // Add auth token interceptor
  axios.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const storage = localStorage.getItem("auth-storage");
      if (storage) {
        const parsed = JSON.parse(storage);
        const token = parsed.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  });

  // Auto-logout whenever the API rejects with 401 (expired or invalid token)
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        forceLogout();
      }
      return Promise.reject(error);
    },
  );
}
