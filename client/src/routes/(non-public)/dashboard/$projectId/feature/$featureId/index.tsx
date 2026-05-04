/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useFeaturesStore } from "@/stores/featuresStore";
import { useProjectsStore } from "@/stores/projectStore";
import { useTasksStore } from "@/stores/tasksStore";
import ensureProject from "@/lib/ensure-projects";
import {
  updateFeedback,
  generateTasks,
  getResults,
  getFeature,
  type Feature,
} from "@/lib/api-endpoints";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { useState } from "react";
import { prefetchTasksIfNeeded } from "@/lib/prefetch-tasks";

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
    let project = projectStore.currentProject;

    // If currentProject is not set or doesn't match, ensure the project exists
    if (!project || project.id !== projectId) {
      project = (await ensureProject(projectId)) || null;

      if (!project) {
        throw redirect({ to: "/dashboard" });
      }

      projectStore.setCurrentProject(project);
    }

    // =========================
    // 2. Check if feature exists in store
    // =========================
    const features = featureStore.featuresByProject[projectId] || [];

    let feature = features.find((f) => f.id === featureId);

    
    // =========================
    // 3. If missing → fetch results or feature
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
      } catch (error) {
        console.log(error);
        // Continue without results
      }

      // If still not found, try to fetch the feature individually
      if (!feature) {
        try {
          const fetchedFeature: any = await getFeature(featureId);
          // Assuming the feature has the structure
          feature = {
            id: fetchedFeature.id || fetchedFeature._id,
            title: fetchedFeature.title,
            description:
              fetchedFeature.justification || fetchedFeature.description || "",
            feedback: fetchedFeature.feedback,
            engineeringTasks: fetchedFeature.engineeringTasks || [],
          };
          // Set it in the store
          const existingFeatures =
            featureStore.featuresByProject[projectId] || [];
          featureStore.setFeatures(projectId, "", [
            ...existingFeatures,
            feature,
          ]);
        } catch (error) {
          console.log(error);
          throw redirect({
            to: "/dashboard/$projectId",
            params: { projectId },
          });
        }
      }
    }

    // =========================
    // 4. Still not found → redirect
    // =========================
    if (!feature) {
      throw redirect({ to: "/dashboard/$projectId", params: { projectId } });
    }

    // =========================
    // 5. Prefetch tasks (RUN ONCE)
    // =========================
    const resultId = useFeaturesStore.getState().resultIdByProject[projectId];
    await prefetchTasksIfNeeded(resultId, featureId, feature.feedback);

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
  const tasks = useTasksStore((s) => s.tasksByFeature[featureId] || []);

  const resultId = useFeaturesStore((s) => s.resultIdByProject[projectId]);

  const feature = features.find((f) => f.id === featureId);

  const tasksCount = useTasksStore((s) => s.getTasksCount(featureId));

  const setTasks = useTasksStore((s) => s.setTasks);

  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      const rawTasks = await generateTasks(resultId, featureId);

      const mappedTasks = rawTasks.map((t: any, index: number) => ({
        id: `${featureId}-${index}`,
        task: t.task,
        estimate: t.estimate,
        priority: t.priority,
      }));

      setTasks(featureId, mappedTasks as any);
      toast.success("Tasks generated");
    } catch {
      toast.error("Failed to generate tasks");
    } finally {
      setLoading(false);
    }
  };

  const isAccepted = feature.feedback === "accepted";
  const isRejected = feature.feedback === "rejected";
  const isNeutral = feature.feedback === "neutral";

  return (
    <>
      <SiteHeader heading={feature?.title || "Feature"} />

      <div className="p-6 flex gap-6 flex-col xl:flex-row">
        {/* LEFT PANEL */}
        <Card className="w-100 h-fit">
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
              <Button
                disabled={loading}
                onClick={handleGenerateTasks}
                className="cursor-pointer"
              >
                {loading ? "Generating..." : "Generate Tasks"}
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
        <div className="flex-1 space-y-4">
          {tasks.length > 0 ? (
            tasks.map((task: any, index: number) => (
              <Card key={task.id || index}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {task.title || `Task ${index + 1}`}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Estimate & Priority */}
                  {task.task && (
                    <p className="text-sm text-muted-foreground">{task.task}</p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    {task.estimate && (
                      <Badge variant="secondary">⏱ {task.estimate}</Badge>
                    )}

                    {task.priority && (
                      <Badge
                        variant={
                          task.priority === "high"
                            ? "default"
                            : task.priority === "medium"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {task.priority}
                      </Badge>
                    )}
                  </div>

                  {/* Status */}
                  {task.status && (
                    <Badge variant="outline">{task.status}</Badge>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">
              No tasks generated yet
            </div>
          )}
        </div>
      </div>
    </>
  );
}
