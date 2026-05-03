import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { ProjectTable } from "@/components/project/project-table";
import { CreateProjectDialog } from "@/components/project/create-project-dialog";
import { getProjects } from "@/lib/api-endpoints";
import { toast } from "sonner";

export const Route = createFileRoute("/(non-public)/(dashboard)/projects/")({
  component: ProjectsPageComponent,
});

export function ProjectsPageComponent() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data || []);
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Projects</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-8 pt-0 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage your analysis workspaces.
            </p>
          </div>
          <CreateProjectDialog onProjectCreated={fetchList} />
        </div>

        <div className="pt-2">
          <ProjectTable projects={projects} loading={loading} />
        </div>
      </div>
    </>
  );
}
