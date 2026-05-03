import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { updateAIResultFeedback } from '@/lib/api-endpoints';
import { toast } from 'sonner';
import { Check, X, RotateCcw } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';
import { Link } from '@tanstack/react-router';

export function AICard({ result, projectId }: { result: any; projectId: string }) {
  const [loading, setLoading] = useState(false);
  const updateFeature = useProjectStore(state => state.updateFeature);

  const handleFeedback = async (decision: 'neutral' | 'accepted' | 'rejected') => {
    try {
      setLoading(true);
      await updateAIResultFeedback(result._id, decision);
      updateFeature(result._id, { feedback: decision });
      toast.success(`Feature marked as ${decision}`);
    } catch (err) {
      toast.error('Failed to update feedback');
    } finally {
      setLoading(false);
    }
  };

  const statusConfig: Record<string, { color: string, label: string }> = {
    neutral: { color: 'bg-slate-500/10 text-slate-600 border-slate-200', label: 'Neutral' },
    accepted: { color: 'bg-green-500/10 text-green-600 border-green-200', label: 'Accepted' },
    rejected: { color: 'bg-red-500/10 text-red-600 border-red-200', label: 'Rejected' },
  };
  
  const currentStatus = statusConfig[result.feedback || 'neutral'] || statusConfig.neutral;

  return (
    <Card className="shadow-sm transition-all hover:shadow-md flex flex-col h-full">
      <Link to="/projects/$id/feature/$featureId" params={{ id: projectId, featureId: result._id }} className="flex-1 cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-4 mb-1">
            <CardTitle className="text-lg font-semibold tracking-tight">{result.title}</CardTitle>
            <Badge className={currentStatus.color} variant="outline">
              {currentStatus.label}
            </Badge>
          </div>
          {result.confidenceScore && (
            <div className="text-xs font-medium text-muted-foreground">
              Confidence: {result.confidenceScore}%
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {result.description}
          </p>
          {result.justification && (
            <div className="bg-muted/30 p-3 rounded-md text-sm border">
              <span className="font-semibold block mb-1">Justification:</span>
              {result.justification}
            </div>
          )}
        </CardContent>
      </Link>
      
      <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-auto">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={(e) => { e.stopPropagation(); handleFeedback('neutral'); }}
          disabled={loading || result.feedback === 'neutral'}
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          onClick={(e) => { e.stopPropagation(); handleFeedback('rejected'); }}
          disabled={loading || result.feedback === 'rejected'}
        >
          <X className="w-3.5 h-3.5 mr-1" />
          Reject
        </Button>
        <Button 
          size="sm" 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={(e) => { e.stopPropagation(); handleFeedback('accepted'); }}
          disabled={loading || result.feedback === 'accepted'}
        >
          <Check className="w-3.5 h-3.5 mr-1" />
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
}
