"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Detail = {
  heading: string;
  count: string;
  description: string;
  badge?: string;
};

export function DashboardCard({ detail }: { detail: Detail }) {
  return (
    <Card className="@container/card max-w-150 w-100">
      <CardHeader>
        <CardDescription className="pb-4">{detail.heading}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {detail.count}
        </CardTitle>
        {detail.badge && (
          <CardAction>
            <Badge variant="outline">{detail.badge}</Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {detail.description}
        </div>
        {/* <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div> */}
      </CardFooter>
    </Card>
    
  );
}
