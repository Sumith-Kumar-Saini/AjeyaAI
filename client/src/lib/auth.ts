import { useAuthStore } from "@/stores/authStore";
import { refreshAuth } from "@/lib/api-endpoints";

export const prefetchAuth = async (): Promise<void> => {
  const store = useAuthStore.getState();

  if (store.isInitialized) return;

  try {
    const data = await refreshAuth();

    if (data.accessToken) {

      console.log(data)
      // ✅ atomic update
      store.setAccessToken(data.accessToken);
    }
  } catch {
    // refresh failed → user is not authenticated
    store.clear();
  } finally {
    store.setInitialized(true);
  }
};
