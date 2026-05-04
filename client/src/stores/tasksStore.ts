// src/stores/tasksStore.ts
import { create } from "zustand";
import type { EngineeringTask } from "@/lib/api-endpoints";

interface TasksState {
  tasksByFeature: Record<string, EngineeringTask[]>;

  setTasks: (featureId: string, tasks: EngineeringTask[]) => void;
  addTasks: (featureId: string, tasks: EngineeringTask[]) => void;

  getTasksCount: (featureId: string) => number;

  clearTasks: (featureId: string) => void;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasksByFeature: {},

  setTasks: (featureId, tasks) =>
    set((state) => ({
      tasksByFeature: {
        ...state.tasksByFeature,
        [featureId]: tasks,
      },
    })),

  addTasks: (featureId, tasks) =>
    set((state) => ({
      tasksByFeature: {
        ...state.tasksByFeature,
        [featureId]: [
          ...(state.tasksByFeature[featureId] || []),
          ...tasks,
        ],
      },
    })),

  getTasksCount: (featureId) => {
    return get().tasksByFeature[featureId]?.length || 0;
  },

  clearTasks: (featureId) =>
    set((state) => {
      const copy = { ...state.tasksByFeature };
      delete copy[featureId];
      return { tasksByFeature: copy };
    }),
}));