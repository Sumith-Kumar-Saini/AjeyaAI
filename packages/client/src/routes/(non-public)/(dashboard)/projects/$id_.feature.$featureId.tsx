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
  getProjectAIResults,
  updateAIResultFeedback,
  generateEngineeringTasks,
} from "@/lib/api-endpoints";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useProjectStore } from "@/stores/projectStore";
import { Check, X, RotateCcw, Hammer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/(non-public)/(dashboard)/projects/$id_/feature/$featureId")({
  component: FeatureDetailPageComponent,
});

export function FeatureDetailPageComponent() {
  const { id, featureId } = Route.useParams();

  const currentProject = useProjectStore((state) => state.currentProject);
  const setCurrentProject = useProjectStore((state) => state.setCurrentProject);
  const results = useProjectStore((state) => state.results);
  const setResults = useProjectStore((state) => state.setResults);
  const updateFeature = useProjectStore((state) => state.updateFeature);

  const [loading, setLoading] = useState(true);
  const [taskLoading, setTaskLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        if (!currentProject || currentProject.id !== id) {
          const proj = await getProject(id);
          setCurrentProject(proj);
        }
        
        // Always fetch results to ensure we have the latest including tasks
        const aiRes = await getProjectAIResults(id);
        setResults(aiRes || []);
      } catch (err) {
        toast.error("Failed to load feature data");
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [id, featureId]);

  const feature = results.find(r => r._id === featureId);

  const handleFeedback = async (decision: 'neutral' | 'accepted' | 'rejected') => {
    try {
      setFeedbackLoading(true);
      await updateAIResultFeedback(featureId, decision);
      updateFeature(featureId, { feedback: decision });
      toast.success(`Feature marked as ${decision}`);
    } catch (err) {
      toast.error('Failed to update feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleGenerateTasks = async () => {
    try {
      setTaskLoading(true);
      const data = await generateEngineeringTasks(featureId);
      // Assuming data returns the updated feature or array of tasks
      // For now, we fetch all results again to sync state, or update directly
      const aiRes = await getProjectAIResults(id);
      setResults(aiRes || []);
      toast.success("Tasks generated successfully!");
    } catch (err) {
      toast.error("Failed to generate tasks");
    } finally {
      setTaskLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8 w-full max-w-screen-2xl mx-auto">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!feature) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh] w-full">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold text-slate-800">Feature Not Found</h2>
          <p className="text-muted-foreground">The feature you are looking for does not exist.</p>
          <Button asChild className="mt-4"><Link to="/projects/$id" params={{ id }}>Back to Project</Link></Button>
        </div>
      </div>
    );
  }

  const statusConfig: Record<string, { color: string, label: string }> = {
    neutral: { color: 'bg-slate-500/10 text-slate-600 border-slate-200', label: 'Neutral' },
    accepted: { color: 'bg-green-500/10 text-green-600 border-green-200', label: 'Accepted' },
    rejected: { color: 'bg-red-500/10 text-red-600 border-red-200', label: 'Rejected' },
  };
  
  const currentStatus = statusConfig[feature.feedback || 'neutral'] || statusConfig.neutral;
  const isAccepted = feature.feedback === 'accepted';

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
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink asChild>
                  <Link to="/projects/$id" params={{ id }}>{currentProject?.name || "Project"}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="truncate max-wxs">
                  Feature Details
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      
      <div className="p-8 space-y-8 w-full max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {feature.title}
              </h1>
              <Badge className={currentStatus.color} variant="outline">
                {currentStatus.label}
              </Badge>
            </div>
            {feature.confidenceScore && (
              <p className="text-sm font-medium text-muted-foreground">
                AI Confidence Score: {feature.confidenceScore}%
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {feature.feedback === 'neutral' ? (
              <>
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => handleFeedback('rejected')}
                  disabled={feedbackLoading}
                >
                  <X className="w-4 h-4 mr-2" /> Reject
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleFeedback('accepted')}
                  disabled={feedbackLoading}
                >
                  <Check className="w-4 h-4 mr-2" /> Accept
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => handleFeedback('neutral')}
                disabled={feedbackLoading}
              >
                <RotateCcw className="w-4 h-4 mr-2" /> Reset Decision
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Description</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {feature.description}
              </p>
            </section>

            {feature.justification && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">AI Justification</h2>
                <div className="bg-muted/30 p-4 rounded-lg border text-slate-700 dark:text-slate-300 leading-relaxed">
                  {feature.justification}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-sm">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Engineering Tasks</h3>
                  {isAccepted && (
                    <Button 
                      size="sm" 
                      onClick={handleGenerateTasks}
                      disabled={taskLoading}
                    >
                      <Hammer className="w-4 h-4 mr-2" />
                      {taskLoading ? 'Generating...' : 'Generate Tasks'}
                    </Button>
                  )}
                </div>

                {!isAccepted && (!feature.engineeringTasks || feature.engineeringTasks.length === 0) ? (
                  <div className="text-sm text-muted-foreground p-4 bg-muted/20 border rounded-md text-center">
                    Accept this feature to generate engineering tasks.
                  </div>
                ) : feature.engineeringTasks && feature.engineeringTasks.length > 0 ? (
                  <ul className="space-y-3">
                    {feature.engineeringTasks.map((task: any, idx: number) => (
                      <li key={idx} className="p-3 border rounded-md bg-background shadow-sm">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <span className="font-medium text-sm">{task.title}</span>
                          <Badge variant="secondary" className="text-[10px] whitespace-nowrap">
                            {task.priority || 'Medium'}
                          </Badge>
                        </div>
                        {task.estimate && (
                          <div className="text-xs text-muted-foreground">
                            Estimate: {task.estimate}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground p-4 bg-muted/20 border rounded-md text-center">
                    No tasks generated yet. Click "Generate Tasks" to break this feature down.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
