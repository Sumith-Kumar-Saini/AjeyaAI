import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { prefetchAuth } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import LoadingScreen from "@/components/loading-screen";

export const Route = createRootRoute({
  beforeLoad: async () => {
    await prefetchAuth();
  },
  pendingComponent: LoadingScreen,
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
      <Toaster />
      {import.meta.env.DEV && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </React.Fragment>
  );
}
