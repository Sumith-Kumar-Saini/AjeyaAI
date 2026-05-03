import { ProjectCards } from "@/components/project-cards";
import { SiteHeader } from "@/components/site-header";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/(non-public)/dashboard/projects/")({
  component: RouteComponent,
});

const testProjects = Array.from({ length: 10 }).map((_, idx) => ({
  id: "asdfsdafasdfasdf" + idx,
  name: "Mobile App",
  description:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia nihil assumenda culpa aperiam illo repudiandae tempora iure blanditiis, architecto quae ut dolorum ratione provident, cumque temporibus possimus eveniet iste voluptas.",
  featureCount: 16,
  createdAt: new Date(),
}));

function RouteComponent() {
  return (
    <>
      <SiteHeader heading="Projects" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <ProjectCards projects={testProjects} />
          </div>
        </div>
      </div>
    </>
  );
}
