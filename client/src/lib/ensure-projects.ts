

import { useProjectsStore } from "@/stores/projectStore";

export default async function ensureProject(projectId: string) {
  const store = useProjectsStore.getState();

  let project = store.projects.find(p => p.id === projectId);

  if (!project) {
    await store.fetchProjects();
    project = useProjectsStore.getState().projects.find(p => p.id === projectId);
  }

  return project;
}


