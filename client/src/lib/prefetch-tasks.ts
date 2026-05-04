import { getTasksByFeature } from "@/lib/api-endpoints";
import { useTasksStore } from "@/stores/tasksStore";
import type { EngineeringTask } from "@/lib/api-endpoints";

export async function prefetchTasksIfNeeded(
  resultId: string | undefined,
  featureId: string,
  feedback: string | undefined,
) {
  const tasksStore = useTasksStore.getState();
  
  // ❌ Only accepted features
  if (feedback !== "accepted") return;

  // ❌ No resultId → cannot fetch
  if (!resultId) return;

  // ✅ Already loaded → skip (IMPORTANT: run once)
  if (tasksStore.isTasksLoaded(featureId)) return;

  try {
    const rawTasks = await getTasksByFeature(resultId, featureId);

    const mappedTasks: EngineeringTask[] = rawTasks.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (t: any, index: number) => ({
        id: `${featureId}-${index}`,
        title: t.task,
        description: `Estimate: ${t.estimate} • Priority: ${t.priority}`,
        status: "task",
      }),
    );

    tasksStore.setTasks(featureId, mappedTasks);
  } catch (error) {
    console.log("Prefetch tasks failed", error);
  }
}
