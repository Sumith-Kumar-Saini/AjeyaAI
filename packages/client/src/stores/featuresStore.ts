/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

export type FeatureFeedback = "neutral" | "accepted" | "rejected";

export interface FeatureIdea {
  id: string;
  title: string;
  description?: string;
  feedback: FeatureFeedback;
  engineeringTasks: any[];
}

interface FeaturesState {
  featuresByProject: Record<string, FeatureIdea[]>;
  resultIdByProject: Record<string, string>;

  setFeatures: (
    projectId: string,
    resultId: string,
    features: FeatureIdea[],
  ) => void;

  updateFeatureFeedback: (
    projectId: string,
    featureId: string,
    feedback: FeatureFeedback,
  ) => void;

  clearFeatures: (projectId: string) => void;
}

export const useFeaturesStore = create<FeaturesState>((set) => ({
  featuresByProject: {},
  resultIdByProject: {},

  setFeatures: (projectId, resultId, features) =>
    set((state) => ({
      featuresByProject: {
        ...state.featuresByProject,
        [projectId]: features,
      },
      resultIdByProject: {
        ...state.resultIdByProject,
        [projectId]: resultId,
      },
    })),

  updateFeatureFeedback: (projectId, featureId, feedback) =>
    set((state) => ({
      featuresByProject: {
        ...state.featuresByProject,
        [projectId]:
          state.featuresByProject[projectId]?.map((f) =>
            f.id === featureId ? { ...f, feedback } : f,
          ) || [],
      },
    })),

  clearFeatures: (projectId) =>
    set((state) => {
      const copy = { ...state.featuresByProject };
      delete copy[projectId];
      return { featuresByProject: copy };
    }),
}));