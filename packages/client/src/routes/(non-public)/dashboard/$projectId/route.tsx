import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useProjectsStore } from "@/stores/projectStore";
import ensureProject from "@/lib/ensure-projects";

export const Route = createFileRoute("/(non-public)/dashboard/$projectId")({
  loader: async ({ params }) => {
    const { projectId } = params;
    const project = await ensureProject(projectId);

    if (!project) throw redirect({ to: "/dashboard" });

    useProjectsStore.getState().setCurrentProject(project);

    return null;
  },

  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
