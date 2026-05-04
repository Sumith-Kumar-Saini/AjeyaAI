import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { useProjectsStore } from "@/stores/projectStore";
import DashboardLayoutSkeleton from "@/components/dashboard-layout-skeleton";

export const Route = createFileRoute("/(non-public)/dashboard")({
  loader: async () => {
    const store = useProjectsStore.getState();

    if (!store.isFetched) {
      try {
        await store.fetchProjects();

        console.log(
          "Dashboard",
          useProjectsStore.getState().projects, // ✅ correct
        );
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
