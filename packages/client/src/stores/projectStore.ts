import { create } from 'zustand';

interface Feature {
  _id: string;
  title: string;
  description: string;
  confidenceScore: number;
  justification: string;
  feedback: 'neutral' | 'accepted' | 'rejected';
  engineeringTasks: any[];
}

interface ProjectState {
  currentProject: any | null;
  results: Feature[];
  selectedFeature: Feature | null;
  setCurrentProject: (project: any) => void;
  setResults: (results: Feature[]) => void;
  setSelectedFeature: (feature: Feature | null) => void;
  updateFeature: (id: string, updates: Partial<Feature>) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  currentProject: null,
  results: [],
  selectedFeature: null,
  setCurrentProject: (project) => set({ currentProject: project }),
  setResults: (results) => set({ results }),
  setSelectedFeature: (feature) => set({ selectedFeature: feature }),
  updateFeature: (id, updates) => set((state) => ({
    results: state.results.map(f => f._id === id ? { ...f, ...updates } : f),
    selectedFeature: state.selectedFeature?._id === id ? { ...state.selectedFeature, ...updates } : state.selectedFeature
  }))
}));
