/* eslint-disable @typescript-eslint/no-explicit-any */
// src/stores/projectsStore.ts

import { create } from "zustand";
import {
  getProjects,
  createProject,
  updateProject,
  type Project,
} from "@/lib/api-projects";

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;

  loading: boolean;
  error: string | null;
  isFetched: boolean;

  fetchProjects: () => Promise<void>;
  addProject: (data: { name: string; description?: string }) => Promise<void>;
  editProject: (
    projectId: string,
    data: { name?: string; description?: string }
  ) => Promise<void>;

  setCurrentProject: (project: Project | null) => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  currentProject: null,

  loading: false,
  error: null,
  isFetched: false, // ✅

  fetchProjects: async () => {
    try {
      set({ loading: true, error: null });

      const projects = await getProjects();

      set({ projects, isFetched: true }); // ✅
    } catch (err: any) {
      set({
        error: err?.response?.data?.error || "Failed to fetch projects",
        isFetched: true, // still mark as fetched
      });
    } finally {
      set({ loading: false });
    }
  },

  /* =========================
     CREATE PROJECT
  ========================= */
  addProject: async (data) => {
    try {
      set({ loading: true, error: null });

      const newProject = await createProject(data);

      set({
        projects: [newProject, ...get().projects],
      });
    } catch (err: any) {
      set({
        error: err?.response?.data?.error || "Failed to create project",
      });
    } finally {
      set({ loading: false });
    }
  },

  /* =========================
     UPDATE PROJECT
  ========================= */
  editProject: async (projectId, data) => {
    try {
      set({ loading: true, error: null });

      const updated = await updateProject(projectId, data);

      set({
        projects: get().projects.map((p) =>
          p.id === projectId ? updated : p
        ),
        currentProject:
          get().currentProject?.id === projectId
            ? updated
            : get().currentProject,
      });
    } catch (err: any) {
      set({
        error: err?.response?.data?.error || "Failed to update project",
      });
    } finally {
      set({ loading: false });
    }
  },

  /* =========================
     CURRENT PROJECT
  ========================= */
  setCurrentProject: (project) => {
    set({ currentProject: project });
  },
}));