import CardStandard1 from "@/components/card-standard-1";
import FileUploadDropzone1 from "@/components/file-upload-dropzone-1";
import { SiteHeader } from "@/components/site-header";
import TextareaFrom1 from "@/components/textarea-form-1";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(non-public)/dashboard/$projectId/")({
  component: RouteComponent,
});

const feature = {
  title: "Title",
  description: "Description",
  content: "content",
  onAction: console.log,
};

function RouteComponent() {
  const { projectId } = Route.useParams();
  return (
    <>
      <SiteHeader heading={projectId} />
      <div className="p-4">
        <h3 className="mx-auto w-full flex justify-center">
          <span className="">Generate Features Idea</span>
        </h3>
        <div className="flex py-10 w-full justify-center gap-6 items-end flex-col sm:flex-row">
          <FileUploadDropzone1 />
          <TextareaFrom1 />
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <CardStandard1 {...feature} />
          <CardStandard1 {...feature} />
          <CardStandard1 {...feature} />
          <CardStandard1 {...feature} />
          <CardStandard1 {...feature} />
          <CardStandard1 {...feature} />
        </div>
      </div>
    </>
  );
}
