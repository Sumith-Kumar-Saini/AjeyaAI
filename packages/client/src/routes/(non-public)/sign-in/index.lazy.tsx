import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(non-public)/sign-in/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(non-public)/sign-in/"!</div>;
}
