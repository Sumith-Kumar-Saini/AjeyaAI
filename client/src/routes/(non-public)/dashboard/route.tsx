/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { useProjectsStore } from "@/stores/projectStore";
import DashboardLayoutSkeleton from "@/components/dashboard-layout-skeleton";
import { useAuthStore } from "@/stores/authStore";
import { initializeAuth } from "@/lib/api-endpoints";
import { toast } from "sonner"; // Added toast integration

// Added utility to safely extract error messages
const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    return (
      (error as any)?.response?.data?.message || // API error
      (error as any)?.message || // JS error
      "Something went wrong. Please try again." // fallback
    );
  }
  return "Something went wrong. Please try again.";
};

export const Route = createFileRoute("/(non-public)/dashboard")({
  loader: async () => {
    const authStore = useAuthStore.getState();

    try {
      // If already have user, skip API call
      if (authStore.user) return null;

      // Added toast.promise for auth initialization
      toast.promise(initializeAuth(), {
        loading: "Checking authentication...",
        success: "Authenticated successfully",
        error: (err) => getErrorMessage(err),
      });
    } catch (error) {
      // Added error handling + toast
      const message = getErrorMessage(error);

      toast.error(message); // Avoid silent failure

      authStore.clearAuth();

      throw redirect({
        to: "/sign-in",
      });
    }

    const store = useProjectsStore.getState();

    if (!store.isFetched) {
      try {
        // Added toast.promise for fetching projects
        toast.promise(store.fetchProjects(), {
          loading: "Loading projects...",
          success: "Projects loaded",
          error: (err) => getErrorMessage(err),
        });
      } catch (error) {
        // Added error handling + toast
        const message = getErrorMessage(error);

        toast.error(message);

        throw redirect({ to: "/sign-in" });
      }
    }

    return null;
  },

  pendingComponent: () => <DashboardLayoutSkeleton />,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
