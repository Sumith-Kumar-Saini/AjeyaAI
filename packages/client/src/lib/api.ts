import axios from "axios";
import { env } from "@/env";
import { useAuthStore } from "@/stores/authStore";

// Create a configured Axios instance
export const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: true, // Important for HttpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach the access token to headers
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// To prevent infinite loops during token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle 401 and refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, wait for the new token and retry
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token using HttpOnly cookie
        const refreshResponse = await axios.post(
          `${env.VITE_API_BASE_URL}/auth/refresh`,
          {},
          {
            withCredentials: true, // Ensure the refresh cookie is sent
          },
        );

        const newAccessToken = refreshResponse.data.accessToken;

        // Update the Zustand store with the new access token
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Process all queued requests with the new token
        processQueue(null, newAccessToken);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is expired or invalid
        processQueue(refreshError, null);

        // Log out the user and clear the token
        useAuthStore.getState().logout();

        // Optionally redirect to login page here, or handle it in the UI layer
        // window.location.href = '/login';

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
