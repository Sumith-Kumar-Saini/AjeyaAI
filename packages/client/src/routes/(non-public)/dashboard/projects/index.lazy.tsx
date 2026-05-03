import { ProjectCards } from "@/components/project-cards";
import { SiteHeader } from "@/components/site-header";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useProjectsStore } from "@/stores/projectStore";

export const Route = createLazyFileRoute("/(non-public)/dashboard/projects/")({
  component: RouteComponent,
});

function RouteComponent() {
  const projects = useProjectsStore((s) => s.projects);
  const loading = useProjectsStore((s) => s.loading);

  return (
    <>
      <SiteHeader heading="Projects" />

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            
            {/* Loading State */}
            {loading ? (
              <div className="text-center text-muted-foreground">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center text-muted-foreground">
                No projects found. Create your first project 🚀
              </div>
            ) : (
              <ProjectCards
                projects={projects.map((p) => ({
                  id: p.id,
                  name: p.name,
                  description: p.description,
                  featureCount: 0, // until backend provides this
                  createdAt: new Date(p.createdAt),
                }))}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}