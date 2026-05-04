/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import {
  analyzeFeedback,
  updateFeedback,
  type Result,
} from "@/lib/api-endpoints";
import { useFeaturesStore } from "@/stores/featuresStore";
import CardStandard1 from "@/components/card-standard-1";
import FileUploadDropzone1 from "@/components/file-upload-dropzone-1";
import { SiteHeader } from "@/components/site-header";
import TextareaFrom1 from "@/components/textarea-form-1";
import { createFileRoute, Navigate, redirect } from "@tanstack/react-router";
import { uploadDocument } from "@/lib/api-endpoints";
import { useProjectsStore } from "@/stores/projectStore";
import ProjectLoading from "@/components/project-loading";
import { Button } from "@/components/ui/button";
import { getResults } from "@/lib/api-endpoints";
import { useState } from "react";
import { useTasksStore } from "@/stores/tasksStore";
import type { Project } from "@/lib/api-projects";
import ensureProject from "@/lib/ensure-projects";

// ✅ Helper to extract meaningful error messages // Added error handling
const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const err = error as any;
    return (
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong. Please try again."
    );
  }
  return "Something went wrong. Please try again.";
};

export const Route = createFileRoute("/(non-public)/dashboard/$projectId/")({
  loader: async ({ params }) => {
    const { projectId } = params;

    const projectStore = useProjectsStore.getState();
    const featureStore = useFeaturesStore.getState();
    const tasksStore = useTasksStore.getState();

    let project;
    try {
      project = await ensureProject(projectId);
    } catch (error) {
      // Added toast feedback
      toast.error(getErrorMessage(error));
      throw redirect({ to: "/dashboard" });
    }

    if (!project || project.id !== projectId) {
      toast.error("Invalid project"); // Added feedback
      throw redirect({ to: "/dashboard" });
    }

    projectStore.setCurrentProject(project);

    let results: Result[] = [];
    try {
      results = await getResults(projectId);
    } catch (error) {
      toast.error(getErrorMessage(error)); // Improved error message
    }

    if (results.length > 0) {
      const latest = results[0];

      const mappedFeatures =
        (latest as any).featureIdeas?.map((f: any) => {
          const tasks = f.engineeringTasks || [];
          tasksStore.setTasks(f._id, tasks);

          return {
            id: f._id,
            title: f.title,
            description: f.justification || "",
            feedback: f.feedback,
            engineeringTasks: [],
          };
        }) || [];

      featureStore.setFeatures(projectId, latest._id, mappedFeatures);
    }

    return null;
  },
  errorComponent: () => <Navigate to="/dashboard" />,
  pendingComponent: () => <ProjectLoading />,
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentProject = useProjectsStore<Project>((s) => s.currentProject!);

  const features = useFeaturesStore(
    (s) => s.featuresByProject[currentProject?.id || ""],
  );

  const resultId = useFeaturesStore(
    (s) => s.resultIdByProject[currentProject?.id || ""],
  );

  const updateLocalFeedback = useFeaturesStore((s) => s.updateFeatureFeedback);

  const shouldHideUpload = features && features.length > 0;

  const isValidFile = (file: File) => {
    const allowedTypes = ["text/csv", "text/plain"];
    const allowedExtensions = [".csv", ".txt"];
    const fileName = file.name.toLowerCase();

    return (
      allowedTypes.includes(file.type) ||
      allowedExtensions.some((ext) => fileName.endsWith(ext))
    );
  };

  const handleAction = async (
    featureId: string,
    action: "accept" | "reject",
  ) => {
    if (!currentProject) return;

    const feedback = action === "accept" ? "accepted" : "rejected";

    // ✅ Promise-based toast // Added toast.promise
    toast.promise(
      updateFeedback(resultId, featureId, feedback)
        .then(() => {
          updateLocalFeedback(currentProject.id, featureId, feedback);
        })
        .catch((error) => {
          throw new Error(getErrorMessage(error));
        }),
      {
        loading: "Updating feedback...",
        success: `Feature ${feedback}`,
        error: (err) => err.message,
      },
    );
  };

  const handleUpload = async () => {
    if (!currentProject) return;

    if (!selectedFile && !textInput.trim()) {
      toast.error("Please upload a file or enter text");
      return;
    }

    if (selectedFile && !isValidFile(selectedFile)) {
      toast.error("Only CSV or TXT files are allowed");
      return;
    }

    try {
      setIsUploading(true);

      // ✅ Upload with toast.promise
      toast.promise(
        uploadDocument({
          projectId: currentProject.id,
          file: selectedFile || undefined,
          text: textInput || undefined,
        }).catch((error) => {
          throw new Error(getErrorMessage(error));
        }),
        {
          loading: "Uploading document...",
          success: "Document uploaded successfully",
          error: (err) => err.message,
        },
      );

      // 2️⃣ AUTO ANALYZE
      if (textInput.trim()) {
        setIsAnalyzing(true);
        const promise = analyzeFeedback(currentProject.id, textInput);

        const result = await promise;
        toast.promise(
          promise.catch((error) => {
            throw new Error(getErrorMessage(error));
          }),
          {
            loading: "Analyzing feedback...",
            success: "Features generated",
            error: (err) => err.message,
          },
        );

        if (!result) return; // Added guard

        const tasksStore = useTasksStore.getState();

        const mappedFeatures =
          (result as any).featureIdeas?.map((f: any) => {
            const tasks = f.engineeringTasks || [];
            tasksStore.setTasks(f._id, tasks);

            return {
              id: f._id,
              title: f.title,
              description: f.justification || "",
              feedback: f.feedback,
              engineeringTasks: [],
            };
          }) || [];

        useFeaturesStore
          .getState()
          .setFeatures(currentProject.id, (result as any)._id, mappedFeatures);
      }

      setSelectedFile(null);
      setTextInput("");
    } catch (error) {
      toast.error(getErrorMessage(error)); // Improved fallback
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentProject || !textInput.trim()) {
      toast.warning("Please enter text to analyze"); // Added validation feedback
      return;
    }

    try {
      setIsAnalyzing(true);

        const promise = analyzeFeedback(currentProject.id, textInput);

        const result = await promise;
        toast.promise(
        analyzeFeedback(currentProject.id, textInput).catch((error) => {
          throw new Error(getErrorMessage(error));
        }),
        {
          loading: "Analyzing feedback...",
          success: "Features generated",
          error: (err) => err.message,
        },
      );

      if (!result) return;

      const tasksStore = useTasksStore.getState();

      const mappedFeatures =
        (result as any).featureIdeas?.map((f: any) => {
          const tasks = f.engineeringTasks || [];
          tasksStore.setTasks(f._id, tasks);

          return {
            id: f._id,
            title: f.title,
            description: f.justification || "",
            feedback: f.feedback,
            engineeringTasks: [],
          };
        }) || [];

      useFeaturesStore
        .getState()
        .setFeatures(currentProject.id, (result as any)._id, mappedFeatures);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <SiteHeader heading={currentProject?.name || "Project"} />

      <div className="p-4 space-y-8">
        {!shouldHideUpload && (
          <>
            <h3 className="text-center text-lg font-semibold">
              Generate Features Idea
            </h3>
            <div className="flex py-6 w-full justify-center gap-6 items-start flex-col sm:flex-row">
              <div className="w-full max-w-md">
                <FileUploadDropzone1
                  onFileSelect={(file) => {
                    if (!file) {
                      toast.error("Please upload CSV or TXT file");
                      return;
                    }
                    if (!isValidFile(file)) {
                      toast.error("Only CSV or TXT files are allowed");
                      return;
                    }
                    setSelectedFile(file);
                  }}
                />
              </div>

              <div className="w-full max-w-md">
                <TextareaFrom1 onTextChange={setTextInput} />
              </div>
            </div>

            <div className="flex gap-6 justify-center">
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>

              <Button onClick={handleSubmit} disabled={isAnalyzing}>
                {isAnalyzing ? "Analyzing..." : "Submit"}
              </Button>
            </div>
          </>
        )}

        <div className="grid mt-4 gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features?.length ? (
            features.map((feature) => (
              <CardStandard1
                key={feature.id}
                title={feature.title}
                description={feature.description || ""}
                content="AI Suggested Feature"
                feedback={feature.feedback}
                onAction={(action) => handleAction(feature.id, action)}
                ids={{ feature: feature.id, project: currentProject.id }}
              />
            ))
          ) : (
            <p className="text-muted-foreground col-span-full text-center">
              No features yet. Run analysis.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
