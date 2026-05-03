import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AICard } from "@/components/ai/ai-card";

export function AITabs({
  results,
  onFeedbackSuccess,
}: {
  results: any[];
  onFeedbackSuccess: () => void;
}) {
  const tabs = [
    { value: "featureIdeas", label: "Feature Ideas" },
    { value: "justification", label: "Justification" },
    { value: "uiSuggestions", label: "UI/UX Suggestions" },
    { value: "engineeringTasks", label: "Engineering Tasks" },
  ];

  return (
    <Tabs defaultValue="featureIdeas" className="w-full">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-auto!">
        {tabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value} className='py-2.5'>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => {
        const typeResults = results?.filter(r => r.type === tab.value) || [];

        return (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            <ScrollArea className="h-125 w-full rounded-md border p-4 bg-muted/10">
              {typeResults.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm py-10">
                  No insights generated for this category yet.
                </div>
              ) : (
                <div className="space-y-4 pr-3">
                  {typeResults.map((result, index) => (
                    <AICard
                      key={result.id}
                      result={result}
                      index={index}
                      onFeedbackSuccess={onFeedbackSuccess}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
