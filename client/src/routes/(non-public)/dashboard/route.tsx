/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { useProjectsStore } from "@/stores/projectStore";
import DashboardLayoutSkeleton from "@/components/dashboard-layout-skeleton";
import { useAuthStore } from "@/stores/authStore";
import { initializeAuth } from "@/lib/api-endpoints";

export const Route = createFileRoute("/(non-public)/dashboard")({
  loader: async () => {
    const authStore = useAuthStore.getState();

    try {
      // If already have user, skip API call
      if (authStore.user) return null;

      await initializeAuth();
    } catch (error) {
      authStore.clearAuth();

      throw redirect({
        to: "/sign-in",
      });
    }

    const store = useProjectsStore.getState();

    if (!store.isFetched) {
      try {
        await store.fetchProjects();
      } catch {
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
