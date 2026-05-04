import { SiteHeader } from "@/components/site-header";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(non-public)/dashboard/documents/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <SiteHeader heading="Documents" />
    </>
  );
}
