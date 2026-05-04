/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "@tanstack/react-router";
import { CirclePlusIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Field, FieldGroup } from "./ui/field";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import type React from "react";
import { useProjectsStore } from "@/stores/projectStore";
import { toast } from "sonner"; // ✅ Toast integration

// ✅ Helper to extract error message // Added error handling
const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const err = error as any;
    return (
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Something went wrong. Please try again."
    );
  }
  return "Something went wrong. Please try again.";
};

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
  }[];
}) {
  const navigate = useNavigate();

  const addProject = useProjectsStore((s) => s.addProject);
  const projects = useProjectsStore((s) => s.projects);

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    // ✅ Validation handling with toast // Added validation feedback
    if (!name?.trim()) {
      toast.warning("Project name is required");
      return;
    }

    try {
      // ✅ Promise-based toast handling // Added toast.promise
      toast.promise(
        addProject({ name, description }).then(() => {
          const latestProject =
            useProjectsStore.getState().projects[0];

          if (!latestProject?.id) {
            throw new Error("Project created but failed to load");
          }

          form.reset();

          navigate({
            to: "/dashboard/$projectId",
            params: { projectId: latestProject.id },
          });
        }).catch((error) => {
          throw new Error(getErrorMessage(error));
        }),
        {
          loading: "Creating project...",
          success: "Project created successfully",
          error: (err) => err.message,
        },
      );
    } catch (error) {
      // ✅ Fallback error handling (prevents silent failures)
      toast.error(getErrorMessage(error)); // Added error handling
      console.error(error);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2 pb-4">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90"
              asChild
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <CirclePlusIcon />
                    <span>Create Project</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-sm">
                  <form className="w-full" onSubmit={handleCreateProject}>
                    <DialogHeader>
                      <DialogTitle>Create Project</DialogTitle>
                      <DialogDescription>
                        create your project
                      </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                      <Field>
                        <Label htmlFor="name-1">Name</Label>
                        <Input id="name-1" name="name" />
                      </Field>

                      <Field>
                        <Label htmlFor="description-1">
                          description{" "}
                          <span className="text-muted-foreground">
                            (optional)
                          </span>
                        </Label>
                        <Input id="description-1" name="description" />
                      </Field>
                    </FieldGroup>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>

                      <DialogClose asChild>
                        <Button type="submit">Create</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link to={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {projects.length > 0 && (
          <SidebarMenu>
            {projects.map((project) => (
              <SidebarMenuItem key={project.id}>
                <SidebarMenuButton asChild>
                  <Link
                    to="/dashboard/$projectId"
                    params={{ projectId: project.id }}
                  >
                    <span>{project.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}