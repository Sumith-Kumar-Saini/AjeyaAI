/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { analyzeFeedback, updateFeedback } from "@/lib/api-endpoints";
import { useFeaturesStore } from "@/stores/featuresStore";
import CardStandard1 from "@/components/card-standard-1";
import FileUploadDropzone1 from "@/components/file-upload-dropzone-1";
import { SiteHeader } from "@/components/site-header";
import TextareaFrom1 from "@/components/textarea-form-1";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { uploadDocument } from "@/lib/api-endpoints";
import { useProjectsStore } from "@/stores/projectStore";
import ProjectLoading from "@/components/project-loading";
import { Button } from "@/components/ui/button";
import { getResults } from "@/lib/api-endpoints";
import { useState } from "react";

export const Route = createFileRoute("/(non-public)/dashboard/$projectId/")({
  loader: async ({ params }) => {
    const { projectId } = params;

    const projectStore = useProjectsStore.getState();
    const featureStore = useFeaturesStore.getState();

    const project = projectStore.projects.find((p) => p.id === projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    projectStore.setCurrentProject(project);

    // 🔥 Fetch results for this project
    const results = await getResults(projectId);

    if (results.length > 0) {
      const latest = results[0];

      // ⚠️ backend uses featureIdeas not features
      const mappedFeatures =
        (latest as any).featureIdeas?.map((f: any) => ({
          id: f._id,
          title: f.title,
          description: f.justification || "",
          feedback: f.feedback,
          engineeringTasks: f.engineeringTasks || [],
        })) || [];

        console.log(results)

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

  const currentProject = useProjectsStore((s) => s.currentProject);
  const features = useFeaturesStore(
    (s) => s.featuresByProject[currentProject?.id || ""],
  );

  const resultId = useFeaturesStore(
    (s) => s.resultIdByProject[currentProject?.id || ""],
  );

  const updateLocalFeedback = useFeaturesStore((s) => s.updateFeatureFeedback);

  const handleAction = async (
    featureId: string,
    action: "accept" | "reject",
  ) => {
    // if (!resultId || !currentProject) return;
    if (!currentProject) return;
    
    const feedback = action === "accept" ? "accepted" : "rejected";
    
    try {
      await updateFeedback(resultId, featureId, feedback);
      
      // 🔥 optimistic UI update
      updateLocalFeedback(currentProject.id, featureId, feedback);

      toast.success(`Feature ${feedback}`);
    } catch (err) {
      toast.error("Failed to update feedback");
    }
  };

  const handleUpload = async () => {
    if (!currentProject) return;

    if (!selectedFile && !textInput.trim()) {
      toast.error("Please upload a file or enter text");
      return;
    }

    try {
      setIsUploading(true);

      await uploadDocument({
        projectId: currentProject.id,
        file: selectedFile || undefined,
        text: textInput || undefined,
      });

      toast.success("Document uploaded successfully");

      // reset state
      setSelectedFile(null);
      setTextInput("");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentProject) return;

    if (!textInput.trim()) {
      toast.error("Please enter a question for analysis");
      return;
    }

    try {
      setIsUploading(true);

      // 🔥 Call AI analysis
      const result = await analyzeFeedback(currentProject.id, textInput);

      // 🔥 Map backend response (same as loader logic)
      const mappedFeatures =
        (result as any).featureIdeas?.map((f: any) => ({
          id: f._id,
          title: f.title,
          description: f.justification || "",
          feedback: f.feedback,
          engineeringTasks: f.engineeringTasks || [],
        })) || [];

      // 🔥 Update store
      useFeaturesStore
        .getState()
        .setFeatures(currentProject.id, result._id, mappedFeatures);

      toast.success("Features generated successfully");
    } catch (err) {
      toast.error("Failed to analyze feedback");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <SiteHeader heading={currentProject?.name || "Project"} />

      <div className="p-4">
        <h3 className="mx-auto w-full flex justify-center">
          <span>Generate Features Idea</span>
        </h3>

        <div className="flex py-10 w-full justify-center gap-6 items-end flex-col sm:flex-row">
          {/* A upload box */}
          <FileUploadDropzone1 onFileSelect={setSelectedFile} />
          {/* Text area */}
          <TextareaFrom1 onTextChange={setTextInput} />
        </div>

        <div className="pb-5 -mt-5 w-full flex gap-6 justify-center items-center">
          <Button
            className="cursor-pointer"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
          <Button
            className="cursor-pointer"
            onClick={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Submit"}
          </Button>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features?.length ? (
            features.map((feature) => (
              <CardStandard1
                key={feature.id}
                title={feature.title}
                description={feature.description || ""}
                content="AI Suggested Feature"
                feedback={feature.feedback}
                onAction={(action) => handleAction(feature.id, action)}
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
