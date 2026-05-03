import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import {
  getProject,
  getProjectDocuments,
  getProjectAIResults,
  analyzeProject,
} from "@/lib/api-endpoints";
import { UploadButton } from "@/components/document/upload-button";
import { DocumentTable } from "@/components/document/document-table";
import { AICard } from "@/components/ai/ai-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useProjectStore } from "@/stores/projectStore";

export const Route = createFileRoute("/(non-public)/(dashboard)/projects/$id")({
  component: ProjectDetailPageComponent,
});

export function ProjectDetailPageComponent() {
  const { id } = Route.useParams();

  const currentProject = useProjectStore((state) => state.currentProject);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const results = useProjectStore((state) => state.results);
  const setResults = useProjectStore((state) => state.setResults);

  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [question, setQuestion] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const fetchAllData = async () => {
    try {
      const [proj, docs, aiRes] = await Promise.all([
        getProject(id),
        getProjectDocuments(id),
        getProjectAIResults(id),
      ]);
      setCurrentProject(proj);
      setDocuments(docs || []);
      setResults(aiRes || []);
    } catch (err) {
      toast.error("Failed to sync project data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchAllData();
    }
  }, [id]);

  const handleAnalyze = async () => {
    if (!question.trim()) return toast.error("Please enter a question");
    try {
      setAnalyzing(true);
      await analyzeProject(id, question);
      toast.success("Analysis complete!");
      setQuestion("");
      fetchAllData(); // Refresh results
    } catch (err) {
      toast.error("Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  let innerContent;

  if (loading) {
    innerContent = (
      <div className="p-8 space-y-8 w-full max-w-screen-2xl mx-auto">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-1/2" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Skeleton className="h-100 rounded-xl" />
          <Skeleton className="h-150 rounded-xl" />
        </div>
      </div>
    );
  } else if (!currentProject) {
    innerContent = (
      <div className="p-8 flex items-center justify-center min-h-[60vh] w-full">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold text-slate-800">
            Project Not Found
          </h2>
          <p className="text-muted-foreground">
            The project you are looking for does not exist or was deleted.
          </p>
        </div>
      </div>
    );
  } else {
    innerContent = (
      <div className="p-8 space-y-8 w-full max-w-screen-2xl mx-auto">
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {currentProject.name}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            {currentProject.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Documents & AI Query */}
          <div className="lg:col-span-4 space-y-8">
            {/* Document Upload */}
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold tracking-tight">
                  Data Sources
                </h2>
                <UploadButton projectId={id} onUploadSuccess={fetchAllData} />
              </div>
              <DocumentTable
                documents={documents}
                onProcessSuccess={fetchAllData}
              />
            </div>

            {/* AI Analysis Query */}
            <div className="space-y-4 border rounded-xl p-6 bg-muted/20">
              <h2 className="text-xl font-semibold tracking-tight">
                Ask AI
              </h2>
              <p className="text-sm text-muted-foreground">
                Generate new features by analyzing the processed documents.
              </p>
              <Textarea 
                placeholder="e.g., What should we build next to improve user retention?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="resize-none"
                rows={4}
              />
              <Button 
                className="w-full" 
                onClick={handleAnalyze} 
                disabled={analyzing || !question.trim()}
              >
                {analyzing ? 'Analyzing...' : 'Generate Features'}
              </Button>
            </div>
          </div>

          {/* Right Column: AI Results Grid */}
          <div className="lg:col-span-8 space-y-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold tracking-tight">
                Generated Features ({results.length})
              </h2>
            </div>
            
            {results.length === 0 ? (
              <div className="flex h-64 items-center justify-center border border-dashed rounded-xl text-muted-foreground text-sm bg-muted/10">
                No features generated yet. Use the Ask AI panel to generate some!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((result) => (
                  <AICard key={result._id} result={result} projectId={id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b">
        <div className="flex items-center gap-2 px-4 w-full">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link to="/projects">Projects</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {currentProject?.name || "Project Details"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      {innerContent}
    </>
  );
}
