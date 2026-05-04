/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useFeaturesStore } from "@/stores/featuresStore";
import { useProjectsStore } from "@/stores/projectStore";
import { useTasksStore } from "@/stores/tasksStore";
import {
  updateFeedback,
  generateTasks,
  getResults,
  type Feature,
} from "@/lib/api-endpoints";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute(
  "/(non-public)/dashboard/$projectId/feature/$featureId/",
)({
  loader: async ({ params }): Promise<null> => {
    const { projectId, featureId } = params;

    const projectStore = useProjectsStore.getState();
    const featureStore = useFeaturesStore.getState();
    const tasksStore = useTasksStore.getState();

    // =========================
    // 1. Ensure project exists
    // =========================
    const project = projectStore.currentProject;

    console.log(projectStore.projects)

    if (!project || project.id !== projectId) {
      throw redirect({ to: "/dashboard" });
    }

    projectStore.setCurrentProject(project);

    // =========================
    // 2. Check if feature exists in store
    // =========================
    const features = featureStore.featuresByProject[projectId] || [];
    let feature = features.find((f) => f.id === featureId);

    // =========================
    // 3. If missing → fetch results
    // =========================
    if (!feature) {
      try {
        const results = await getResults(projectId);

        if (results.length > 0) {
          const latest = results[0];

          const mappedFeatures =
            (latest as any).featureIdeas?.map((f: any) => {
              const tasks = f.engineeringTasks || [];

              // hydrate tasks
              tasksStore.setTasks(f._id, tasks);

              return {
                id: f._id,
                title: f.title,
                description: f.justification || "",
                feedback: f.feedback,
                engineeringTasks: [],
              };
            }) || [];

          featureStore.setFeatures(projectId, latest._id, mappedFeatures);

          // 🔁 retry after hydration
          feature = mappedFeatures.find((f: Feature) => f.id === featureId);
        }
      } catch {
        throw redirect({ to: "/dashboard/$projectId", params: { projectId } });
      }
    }

    // =========================
    // 4. Still not found → redirect
    // =========================
    if (!feature) {
      throw redirect({ to: "/dashboard/$projectId", params: { projectId } });
    }

    return null;
  },

  errorComponent: () => {
    return <div>Something went wrong. Redirecting...</div>;
  },

  component: RouteComponent,
});

function RouteComponent() {
  const { projectId, featureId } = Route.useParams();

  const currentProject = useProjectsStore((s) => s.currentProject);
  const features = useFeaturesStore(
    (s) => s.featuresByProject[projectId] || [],
  );

  const resultId = useFeaturesStore((s) => s.resultIdByProject[projectId]);

  const feature = features.find((f) => f.id === featureId);

  const tasksCount = useTasksStore((s) => s.getTasksCount(featureId));

  const setTasks = useTasksStore((s) => s.setTasks);

  if (!feature) return <div>Feature not found</div>;

  const handleFeedback = async (action: "accept" | "reject") => {
    if (!resultId || !currentProject) return;

    const feedback = action === "accept" ? "accepted" : "rejected";

    try {
      await updateFeedback(resultId, featureId, feedback);

      useFeaturesStore
        .getState()
        .updateFeatureFeedback(projectId, featureId, feedback);

      toast.success(`Feature ${feedback}`);
    } catch {
      toast.error("Failed to update feedback");
    }
  };

  const handleGenerateTasks = async () => {
    if (!resultId) return;

    try {
      const tasks = await generateTasks(resultId, featureId);

      setTasks(featureId, tasks);

      toast.success("Tasks generated");
    } catch {
      toast.error("Failed to generate tasks");
    }
  };

  const isAccepted = feature.feedback === "accepted";
  const isRejected = feature.feedback === "rejected";
  const isNeutral = feature.feedback === "neutral";

  return (
    <>
      <SiteHeader heading={feature?.title || "Feature"} />

      <div className="p-6 flex gap-6">
        {/* LEFT PANEL */}
        <Card className="w-100">
          <CardHeader>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 flex flex-col gap-4">
            <p className="text-muted-foreground">{feature.description}</p>

            {/* BADGE */}
            {isAccepted && <Badge>Accepted</Badge>}
            {isRejected && <Badge variant="outline">Rejected</Badge>}

            {/* ACTION BUTTONS */}
            {isNeutral && (
              <div className="flex gap-2">
                <Button
                  className="cursor-pointer"
                  onClick={() => handleFeedback("accept")}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleFeedback("reject")}
                >
                  Reject
                </Button>
              </div>
            )}

            {/* GENERATE TASK BUTTON */}
            {isAccepted && tasksCount === 0 && (
              <Button className="cursor-pointer" onClick={handleGenerateTasks}>
                Generate Tasks
              </Button>
            )}

            {/* TASK COUNT */}
            {tasksCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {tasksCount} tasks generated
              </p>
            )}
          </CardContent>
        </Card>

        {/* RIGHT SIDE (future tasks list) */}
        <div className="flex-1">
          {/* You can render task list here later */}
        </div>
      </div>
    </>
  );
}
