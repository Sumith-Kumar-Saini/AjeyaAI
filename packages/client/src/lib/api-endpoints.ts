import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

/* =========================
   API CONSTANTS
========================= */
const ENDPOINTS = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",

  ANALYZE_FEEDBACK: "/feedback/analyze",
  RESULTS: "/results",
  FEATURES: "/features",
  TASKS: "/tasks",
} as const;

/* =========================
   BASE TYPES
========================= */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/* =========================
   AUTH TYPES
========================= */
export interface AuthResponse {
  accessToken: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

/* =========================
   CORE TYPES
   (Match backend exactly)
========================= */
export type FeedbackType = "neutral" | "accepted" | "rejected";

export interface Feature {
  id: string;
  name: string;
  description: string;
}

export interface EngineeringTask {
  id: string;
  title: string;
  description: string;
  status: string;
}

export interface Result {
  id: string;
  projectId: string;
  features: Feature[];
  createdAt: string;
}

/* =========================
   GENERIC REQUEST HANDLER
========================= */
async function request<T>(
  promise: Promise<{ data: ApiResponse<T> }>,
): Promise<T> {
  const response = await promise;
  return response.data.data;
}

/* =========================
   AUTH API
========================= */
export async function login(email: string, password: string): Promise<void> {
  const data = await request<AuthResponse>(
    api.post(ENDPOINTS.LOGIN, { email, password }),
  );

  useAuthStore.getState().setAccessToken(data.accessToken);
}

export async function signup(
  name: string,
  email: string,
  password: string,
): Promise<void> {
  const data = await request<AuthResponse>(
    api.post(ENDPOINTS.SIGNUP, { name, email, password }),
  );

  useAuthStore.getState().setAccessToken(data.accessToken);
}

export async function logout(): Promise<void> {
  await request<void>(api.post(ENDPOINTS.LOGOUT));

  const store = useAuthStore.getState();
  store.clearAuth();
}

export async function getMe(): Promise<User> {
  return request<User>(api.get(ENDPOINTS.ME));
}

/* =========================
   FEATURE APIs
========================= */
export async function analyzeFeedback(
  projectId: string,
  question: string,
): Promise<Result> {
  return request<Result>(
    api.post(ENDPOINTS.ANALYZE_FEEDBACK, { projectId, question }),
  );
}

export async function getResults(projectId?: string): Promise<Result[]> {
  return request<Result[]>(
    api.get(ENDPOINTS.RESULTS, {
      params: projectId ? { projectId } : undefined,
    }),
  );
}

export async function getResult(resultId: string): Promise<Result> {
  return request<Result>(api.get(`${ENDPOINTS.RESULTS}/${resultId}`));
}

export async function getFeature(featureId: string): Promise<Feature> {
  return request<Feature>(api.get(`${ENDPOINTS.FEATURES}/${featureId}`));
}

export async function updateFeedback(
  resultId: string,
  featureId: string,
  feedback: FeedbackType,
): Promise<void> {
  await request<void>(
    api.patch(`${ENDPOINTS.RESULTS}/${resultId}/features/${featureId}`, {
      feedback,
    }),
  );
}

export async function generateTasks(
  resultId: string,
  featureId: string,
): Promise<EngineeringTask[]> {
  return request<EngineeringTask[]>(
    api.post(`${ENDPOINTS.TASKS}/${resultId}/${featureId}`),
  );
}

/* =========================
   AUTH INITIALIZATION
========================= */
export async function initializeAuth(): Promise<void> {
  const store = useAuthStore.getState();

  try {
    const user = await getMe();
    store.setUser(user);
    store.setInitialized(true);
  } catch {
    store.clearAuth();
  } finally {
    store.setInitialized(true);
  }
}
