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

export const Route = createFileRoute("/(non-public)/dashboard/$projectId/")({
  loader: async ({ params }) => {
    const { projectId } = params;

    const projectStore = useProjectsStore.getState();
    const featureStore = useFeaturesStore.getState();
    const tasksStore = useTasksStore.getState();

    let project;
    try {
      project = await ensureProject(projectId);
    } catch {
      throw redirect({ to: "/dashboard" });
    }

    if (!project || project.id !== projectId) {
      throw redirect({ to: "/dashboard" });
    }

    projectStore.setCurrentProject(project);

    let results: Result[] = [];
    try {
      results = await getResults(projectId);
    } catch {}

    if (results.length > 0) {
      const latest = results[0];

      const mappedFeatures =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // ✅ hide only when backend data exists
  const shouldHideUpload = features && features.length > 0;

  // ✅ FILE VALIDATION
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

    try {
      await updateFeedback(resultId, featureId, feedback);
      updateLocalFeedback(currentProject.id, featureId, feedback);
      toast.success(`Feature ${feedback}`);
    } catch {
      toast.error("Failed to update feedback");
    }
  };

  // 🔥 MAIN FLOW
  const handleUpload = async () => {
    if (!currentProject) return;

    if (!selectedFile && !textInput.trim()) {
      toast.error("Please upload a file or enter text");
      return;
    }

    // ✅ FILE TYPE CHECK
    if (selectedFile && !isValidFile(selectedFile)) {
      toast.error("Only CSV or TXT files are allowed");
      return;
    }

    try {
      setIsUploading(true);

      // 1️⃣ Upload
      await uploadDocument({
        projectId: currentProject.id,
        file: selectedFile || undefined,
        text: textInput || undefined,
      });

      toast.success("Document uploaded");

      // 2️⃣ AUTO ANALYZE
      if (textInput.trim()) {
        setIsAnalyzing(true);

        const result = await analyzeFeedback(currentProject.id, textInput);

        const tasksStore = useTasksStore.getState();

        const mappedFeatures =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          .setFeatures(currentProject.id, result._id, mappedFeatures);

        toast.success("Features generated");
      }

      setSelectedFile(null);
      setTextInput("");

    } catch {
      toast.error("Something failed");
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentProject || !textInput.trim()) return;

    try {
      setIsAnalyzing(true);

      const result = await analyzeFeedback(currentProject.id, textInput);

      const tasksStore = useTasksStore.getState();

      const mappedFeatures =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        .setFeatures(currentProject.id, result._id, mappedFeatures);

      toast.success("Features generated");
    } catch {
      toast.error("Failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <SiteHeader heading={currentProject?.name || "Project"} />

      <div className="p-4 space-y-8">
        <h3 className="text-center text-lg font-semibold">
          Generate Features Idea
        </h3>

        {!shouldHideUpload && (
          <>
            <div className="flex py-6 w-full justify-center gap-6 items-start flex-col sm:flex-row">
              <div className="w-full max-w-md">
                <FileUploadDropzone1
                  onFileSelect={(file) => {
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