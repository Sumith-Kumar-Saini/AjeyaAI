import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { useProjectsStore } from "@/stores/projectStore";
import DashboardLayoutSkeleton from "@/components/dashboard-layout-skeleton";

export const Route = createFileRoute("/(non-public)/dashboard")({
  loader: async () => {
    const store = useProjectsStore.getState();

    // avoid refetch if already loaded
    if (!store.projects.length) {
      await store.fetchProjects();
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
