import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(non-public)/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(non-public)/dashboard/"!</div>;
}
