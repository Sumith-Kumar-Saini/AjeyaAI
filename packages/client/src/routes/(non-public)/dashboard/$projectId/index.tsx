import FileUploadDropzone1 from "@/components/file-upload-dropzone-1";
import { SiteHeader } from "@/components/site-header";
import TextareaFrom1 from "@/components/textarea-form-1";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(non-public)/dashboard/$projectId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { projectId } = Route.useParams();
  return (
    <>
      <SiteHeader heading={projectId} />
      <div className="gap-6">
        <h3 className="mx-auto w-full flex justify-center pt-5">
          <span className="">Generate Features Idea</span>
        </h3>
        <div className="flex pt-10 w-full justify-center gap-6 items-end">
          <FileUploadDropzone1 />
          <TextareaFrom1 />
        </div>
      </div>
    </>
  );
}
