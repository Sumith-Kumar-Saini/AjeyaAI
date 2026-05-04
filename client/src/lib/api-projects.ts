// src/lib/api-projects.ts

import { api } from "@/lib/api";

/* =========================
   TYPES (match backend)
========================= */

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/* =========================
   GENERIC HANDLER
========================= */

async function request<T>(
  promise: Promise<{ data: ApiResponse<T> }>
): Promise<T> {
  const res = await promise;
  return res.data.data;
}

/* =========================
   PROJECT APIs
========================= */

export async function getProjects(): Promise<Project[]> {
  return request<Project[]>(api.get("/projects"));
}

export async function createProject(data: {
  name: string;
  description?: string;
}): Promise<Project> {
  return request<Project>(api.post("/projects", data));
}

export async function updateProject(
  projectId: string,
  data: {
    name?: string;
    description?: string;
  }
): Promise<Project> {
  return request<Project>(api.patch(`/projects/${projectId}`, data));
}