import { createFileRoute, redirect } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { getMe } from "@/lib/api-endpoints";
import { useAuthStore } from "@/stores/authStore";
import DashboardSkeleton from "@/components/dashboard-skeleton";
import { useProjectsStore } from "@/stores/projectStore";

export const Route = createFileRoute("/(non-public)/dashboard/(overview)/")({
  loader: async () => {
    const store = useAuthStore.getState();

    try {
      // If already have user, skip API call
      if (store.user) return null;

      const user = await getMe();
      store.setUser(user);

      return null;
    } catch (error) {
      store.clearAuth();

      throw redirect({
        to: "/sign-in",
      });
    }
  },

  pendingComponent: () => <DashboardSkeleton />, // loading screen
  component: RouteComponent,
});

function RouteComponent() {
  const projects = useProjectsStore((s) => s.projects);

  return (
    <>
      <SiteHeader heading="Overview" />

      <div className="flex flex-col justify-center gap-4 px-4 lg:px-6 pt-20">
        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Your total projects
              </p>
            </CardContent>
          </Card>

          {/* Keep placeholders until backend exists */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">
                Coming soon
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Processed Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">
                Coming soon
              </p>
            </CardContent>
          </Card>
        </div>

        {/* PROJECTS TABLE */}
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Your latest created projects
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableCaption>
                <Link to="/dashboard/projects" className="hover:underline">
                  View ALL Projects
                </Link>
              </TableCaption>

              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No projects found
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.slice(0, 5).map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        {project.name}
                      </TableCell>

                      <TableCell>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </TableCell>

                      <TableCell>
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="text-right">
                        <Link
                          to="/dashboard/$projectId"
                          params={{ projectId: project.id }}
                        >
                          <Button className="rounded-sm cursor-pointer">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}