import axios, { AxiosError } from "axios";
import { authStorage } from "../storage";
import { useAppStore } from "@/store/useAppStore";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = authStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add Accept-Language header based on current locale
    if (typeof window !== "undefined" && config.headers) {
      const locale = localStorage.getItem("hakeem_locale") || "en";
      config.headers["Accept-Language"] = locale;
    }
    
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // The backend wraps all responses in GenericResponseModel: { success, data, message, errorList, globalErrorCode }
    // Unwrap automatically so consumers get the inner payload directly
    if (
      response.data &&
      typeof response.data === "object" &&
      "success" in response.data &&
      "data" in response.data
    ) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (
      !originalRequest ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/refresh")
    ) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest._retry = true;
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      const refreshToken = authStorage.getRefreshToken();
      if (!refreshToken) {
        authStorage.clearTokens();
        useAppStore.getState().setAccessToken(null);
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${BASE_URL}/refresh`,
          { refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          },
        );

        let resBody: any = response.data;
        if (typeof resBody === "string") {
          try {
            resBody = JSON.parse(resBody);
          } catch {
            // keep as-is if parsing fails
          }
        }

        const payload = resBody?.data || resBody;
        const newAccessToken = payload?.accessToken;
        const newRefreshToken = payload?.refreshToken || refreshToken;

        if (!newAccessToken) {
          throw new Error("No accessToken found in refresh response");
        }

        authStorage.setAccessToken(newAccessToken);
        authStorage.setRefreshToken(newRefreshToken);
        useAppStore.getState().setAccessToken(newAccessToken);

        api.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStorage.clearTokens();
        useAppStore.getState().setAccessToken(null);
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle 403 Forbidden globally
    if (error.response?.status === 403) {
      if (typeof window !== "undefined") {
        if (window.location.pathname.includes('/doctor/patients/workspace/')) {
          window.location.href = "/doctor/patients?access_denied=true";
        }
      }
    }

    return Promise.reject(error);
  },
);
