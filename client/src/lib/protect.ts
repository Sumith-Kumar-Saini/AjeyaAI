import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/authStore";

/* =========================
   UTIL: WAIT FOR INIT
========================= */
function waitForInitialization(): Promise<void> {
  return new Promise((resolve) => {
    const unsubscribe = useAuthStore.subscribe((state) => {
      if (state.isInitialized) {
        unsubscribe();
        resolve();
      }
    });
  });
}

/* =========================
   ROUTE GUARD
========================= */
export const protect = async () => {
  const store = useAuthStore.getState();

  if (!store.isInitialized) {
    await waitForInitialization();
  }

  const { isAuthenticated } = useAuthStore.getState();

  if (!isAuthenticated) {
    throw redirect({
      to: "/sign-in",
    });
  }

  return;
};
