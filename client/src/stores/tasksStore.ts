import { create } from "zustand";
import type { EngineeringTask } from "@/lib/api-endpoints";

interface TasksState {
  tasksByFeature: Record<string, EngineeringTask[]>;
  loadedByFeature: Record<string, boolean>;

  setTasks: (featureId: string, tasks: EngineeringTask[]) => void;
  addTasks: (featureId: string, tasks: EngineeringTask[]) => void;

  getTasksCount: (featureId: string) => number;
  isTasksLoaded: (featureId: string) => boolean;

  clearTasks: (featureId: string) => void;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasksByFeature: {},
  loadedByFeature: {},

  setTasks: (featureId, tasks) =>
    set((state) => ({
      tasksByFeature: {
        ...state.tasksByFeature,
        [featureId]: tasks,
      },
      loadedByFeature: {
        ...state.loadedByFeature,
        [featureId]: true,
      },
    })),

  addTasks: (featureId, tasks) =>
    set((state) => ({
      tasksByFeature: {
        ...state.tasksByFeature,
        [featureId]: [...(state.tasksByFeature[featureId] || []), ...tasks],
      },
    })),

  getTasksCount: (featureId) => {
    return get().tasksByFeature[featureId]?.length || 0;
  },

  isTasksLoaded: (featureId) => {
    return get().loadedByFeature[featureId] === true;
  },

  clearTasks: (featureId) =>
    set((state) => {
      const tasksCopy = { ...state.tasksByFeature };
      const loadedCopy = { ...state.loadedByFeature };

      delete tasksCopy[featureId];
      delete loadedCopy[featureId];

      return {
        tasksByFeature: tasksCopy,
        loadedByFeature: loadedCopy,
      };
    }),
}));
