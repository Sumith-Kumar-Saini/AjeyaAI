/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useProjectsStore } from "@/stores/projectStore";
import ensureProject from "@/lib/ensure-projects";
import { toast } from "sonner"; // Added toast integration

export const Route = createFileRoute("/(non-public)/dashboard/$projectId")({
  loader: async ({ params }) => {
    const { projectId } = params;

    try {
      // Create the promise separately to preserve correct typing
      const projectPromise = ensureProject(projectId); // ✅ keeps type: Promise<Project | undefined>

      // Attach toast handling without affecting the resolved type
      toast.promise(projectPromise, {
        loading: "Loading project...",
        success: (data) => {
          if (!data) return "Project not found.";
          return "Project loaded successfully.";
        },
        error: (error) => {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong. Please try again.";
          return message;
        },
      }); // ✅ Toast integration without breaking types

      const project = await projectPromise; // ✅ Correctly typed

      // Handle missing project
      if (!project) {
        throw redirect({ to: "/dashboard" });
      }

      // Zustand state update
      useProjectsStore.getState().setCurrentProject(project);

      return null;
    } catch (error: any) {
      // Extract error message safely
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

      // Avoid duplicate toast if already shown via toast.promise
      if (!error?.__handled) {
        toast.error(message); // Added fallback error handling
      }

      // Network/offline handling
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        toast.error("You appear to be offline. Please check your connection."); // Added network awareness
      }

      // Preserve redirect behavior
      if (error?.isRedirect) {
        throw error;
      }

      // Ensure no silent failure
      throw redirect({ to: "/dashboard" });
    }
  },

  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
