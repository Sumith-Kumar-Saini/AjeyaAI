import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";

export const prefetchAuth = async (): Promise<void> => {
  const store = useAuthStore.getState();

  // Prevent duplicate prefetching if already initialized
  if (store.isInitialized) {
    return;
  }

  try {
    // Call the backend prefetch endpoint which relies on HttpOnly cookies
    const response = await api.post("/auth/refresh");

    if (response.data?.accessToken) {
      store.setAccessToken(response.data.accessToken);
    }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Usually means the user is not authenticated or refresh token expired
    store.logout();
  } finally {
    // Mark auth as initialized so we don't repeat this on every route change
    store.setInitialized(true);
  }
};
