import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet } from "@tanstack/react-router";
import { createLazyFileRoute } from "@tanstack/react-router";
import React from "react";

export const Route = createLazyFileRoute("/(non-public)")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <React.Fragment>
      <TooltipProvider>
        <Outlet />
      </TooltipProvider>
    </React.Fragment>
  );
}
