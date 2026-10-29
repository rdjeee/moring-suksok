/**
 * Moring Suksok — API Client (Axios + JWT interceptors)
 *
 * Spec reference:
 *   - specs/02-architecture.md (arsitektur decoupled frontend ↔ backend)
 *   - specs/06-api-contracts.md (endpoint contracts)
 *   - specs/04-ui-guidelines.md §5.5 (toast notifications for errors)
 *
 * Features:
 *   - Axios instance dengan baseURL dari NEXT_PUBLIC_API_URL
 *   - Request interceptor: auto-attach JWT token dari localStorage
 *   - Response interceptor: handle 401 (auto-logout + redirect ke /login)
 *   - Sandbox gateway-aware: otomatis pakai relative path di Z.ai sandbox
 *     (Caddy gateway forward ke backend port 8000 via XTransformPort)
 *   - TypeScript types untuk API responses
 *   - formatIDR helper untuk format Rupiah (spec §3.3)
 *
 * Usage:
 *   import api from "@/lib/api";
 *   const products = await api.get<Product[]>("/products");
 *   const order = await api.post<Order>("/orders", { ... });
 */
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
/** localStorage key untuk JWT token (consistent across app) */
export const TOKEN_KEY = "moring_token";

/** Backend API base URL dari env (production: http://localhost:8000/api/v1 atau cloud) */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// ---------------------------------------------------------------------------
// Sandbox gateway detection
// ---------------------------------------------------------------------------
/**
 * Detect apakah kita di Z.ai sandbox preview.
 *
 * Di sandbox, frontend di-serve dari domain *.z.ai, dan backend FastAPI berjalan
 * di port 8000. Karena sandbox hanya expose 1 port externally, kita pakai Caddy
 * gateway dengan query param ?XTransformPort=8000 untuk forward request ke backend.
 *
 * Di production (mesin lokal user / Vercel), frontend langsung call NEXT_PUBLIC_API_URL.
 */
function getBaseURL(): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // Z.ai sandbox preview domains
    if (hostname.includes("z.ai") || hostname.includes("space-z.ai")) {
      // Pakai relative path. Tapi axios baseURL dengan relative path bisa tricky,
      // jadi kita pakai origin + /api/v1 dan inject XTransformPort di interceptor.
      return `${window.location.origin}/api/v1`;
    }
  }
  return API_URL;
}

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
const api: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 detik timeout
});

// ---------------------------------------------------------------------------
// Request interceptor: attach JWT token
// ---------------------------------------------------------------------------
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach JWT token jika ada (client-side only — localStorage tidak ada di SSR)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Sandbox gateway: inject XTransformPort=8000 untuk forward ke backend FastAPI.
    // Caddy gateway akan route request berdasarkan query param ini.
    if (typeof window !== "undefined" && config.url) {
      const hostname = window.location.hostname;
      if (hostname.includes("z.ai") || hostname.includes("space-z.ai")) {
        config.params = {
          ...config.params,
          XTransformPort: 8000,
        };
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ---------------------------------------------------------------------------
// Response interceptor: handle 401 (auto-logout) + normalize errors
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // 401 Unauthorized: token expired atau invalid → auto-logout
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
        // Redirect ke /login (halaman login akan dibuat di Step 8+)
        // Hanya redirect kalau belum di /login (avoid loop)
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }

    // Normalize error untuk consistency
    const normalizedError = {
      message:
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan jaringan",
      status: error.response?.status ?? 0,
      data: error.response?.data,
      isNetworkError: !error.response,
      isAuthError: error.response?.status === 401,
    };

    return Promise.reject(normalizedError);
  },
);

// ---------------------------------------------------------------------------
// Typed API helpers (convenience wrappers)
// ---------------------------------------------------------------------------
export interface ApiError {
  message: string;
  status: number;
  data?: unknown;
  isNetworkError: boolean;
  isAuthError: boolean;
}

/**
 * Generic typed request helper.
 * Usage: const products = await apiRequest<Product[]>("/products", { method: "GET" })
 */
export async function apiRequest<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  const response = await api.request<T>({ url, ...config });
  return response.data;
}

/** Convenience methods dengan typing */
export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) => apiRequest<T>(url, { ...config, method: "GET" }),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiRequest<T>(url, { ...config, method: "POST", data }),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiRequest<T>(url, { ...config, method: "PUT", data }),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiRequest<T>(url, { ...config, method: "PATCH", data }),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>(url, { ...config, method: "DELETE" }),
};

// ---------------------------------------------------------------------------
// Token management helpers (untuk auth context di Step 8+)
// ---------------------------------------------------------------------------
export const tokenManager = {
  /** Get current JWT token (client-side only) */
  get(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  /** Save JWT token setelah login */
  set(token: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  /** Remove JWT token (logout) */
  remove(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
  },

  /** Check if user is authenticated (has token) */
  isAuthenticated(): boolean {
    return this.get() !== null;
  },
};

// ---------------------------------------------------------------------------
// Utility: format harga ke Rupiah Indonesia (spec §3.3)
// ---------------------------------------------------------------------------
/**
 * Format angka ke format Rupiah Indonesia.
 * Contoh: 75000 → "Rp 75.000"
 *         15000.5 → "Rp 15.001"
 *
 * Spec §3.3: "Rp 75.000" (titik sebagai pemisah ribuan, tanpa desimal)
 */
export function formatIDR(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (Number.isNaN(num)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

// ---------------------------------------------------------------------------
// Utility: format tanggal Indonesia (spec §3 — Bahasa Indonesia)
// ---------------------------------------------------------------------------
/**
 * Format ISO date string ke format Indonesia.
 * Contoh: "2026-10-29T15:30:00" → "29 Okt 2026, 15.30"
 */
export function formatDateID(isoDate: string, withTime = false): string {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "-";

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime && { hour: "2-digit", minute: "2-digit" }),
  };
  return new Intl.DateTimeFormat("id-ID", options).format(date);
}

// Default export: axios instance (untuk advanced usage)
export default api;
