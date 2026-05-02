import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(non-public)/sign-up/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(non-public)/sign-up/"!</div>;
}
