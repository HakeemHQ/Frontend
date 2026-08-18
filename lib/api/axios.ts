import axios, { AxiosError } from "axios";
import { authStorage } from "../storage";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://hakeem1.runasp.net",
  timeout: 60000,
});

api.interceptors.request.use(
  (config) => {
    const token = authStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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
    if (response.data && typeof response.data === "object" && "success" in response.data && "data" in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (originalRequest?.url?.includes('/auth/login') || originalRequest?.url?.includes('/refresh')) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = authStorage.getRefreshToken();
      if (!refreshToken) {
        authStorage.clearTokens();
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post<{
          data: { accessToken: string; refreshToken: string };
        }>(`${api.defaults.baseURL}/refresh`, { refreshToken });

        const newAccessToken = data.data.accessToken;
        const newRefreshToken = data.data.refreshToken;

        authStorage.setAccessToken(newAccessToken);
        authStorage.setRefreshToken(newRefreshToken);

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
        if (typeof window !== "undefined") window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
