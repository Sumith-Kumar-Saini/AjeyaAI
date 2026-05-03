import { api } from "./api"; // Your pre-configured Axios instance

export const getProjects = async () => {
  const { data } = await api.get('/api/projects');
  return data;
};

export const createProject = async (payload: { name: string; description: string }) => {
  const { data } = await api.post('/api/projects', payload);
  return data;
};

export const getProject = async (id: string) => {
  const { data } = await api.get(`/api/projects/${id}`);
  return data;
};

export const getProjectDocuments = async (projectId: string) => {
  // Assuming a GET endpoint exists to fetch a project's documents
  const { data } = await api.get(`/api/projects/${projectId}/documents`); 
  return data;
};

export const uploadDocument = async (projectId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("projectId", projectId);
  
  const { data } = await api.post('/api/documents/upload', formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const processDocument = async (documentId: string) => {
  const { data } = await api.post('/api/documents/process', { documentId });
  return data;
};

export const analyzeProject = async (projectId: string, question: string) => {
  const { data } = await api.post('/api/ai/analyze', { projectId, question });
  return data;
};

export const getProjectAIResults = async (projectId: string) => {
  const { data } = await api.get(`/api/results?projectId=${projectId}`); 
  return data;
};

export const updateAIResultFeedback = async (
  id: string,
  feedback: "neutral" | "accepted" | "rejected"
) => {
  const { data } = await api.patch(`/api/results/${id}/feedback`, { feedback });
  return data;
};

export const generateEngineeringTasks = async (resultId: string) => {
  const { data } = await api.post(`/api/tasks/${resultId}/generate`);
  return data;
};
