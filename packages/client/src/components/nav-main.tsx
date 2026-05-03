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
import { api } from "@/lib/api"; // adjust if it's a named export
import type React from "react";

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

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    
    if (!name?.trim()) {
      alert("Project name is required");
      return;
    }
    
    try {
      const { data } = await api.post("/projects", {
        name,
        description,
      });

      console.log("Created project:", data);
      
      // reset form
      form.reset();
      
      return navigate({
        to: "/dashboard/$projectId",
        params: { projectId: "asdf" },
      });
      
      // TODO: close dialog if controlled
      // setOpen(false);
    } catch (error: any) {
      console.error(error);

      // Axios error handling
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      alert(message);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2 pb-4">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
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
                      <DialogDescription>create your project</DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                      <Field>
                        <Label htmlFor="name-1">Name</Label>
                        <Input
                          id="name-1"
                          name="name"
                        />
                      </Field>
                      <Field>
                        <Label htmlFor="username-1">
                          description
                          <span className="text-muted-foreground">
                            (optional)
                          </span>
                        </Label>
                        <Input
                          id="description-1"
                          name="description"
                        />
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
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
