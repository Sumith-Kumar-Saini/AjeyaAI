"use client";

import { Link } from "@tanstack/react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Project = {
  id: string;
  name: string;
  description: string;
  featureCount: number;
  createdAt: string | Date;
};

export function ProjectCards({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 sm:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => {
        const formattedDate = new Date(project.createdAt).toLocaleDateString();

        return (
          <Card key={project.id} className="@container/card">
            <CardHeader>
              {/* Project Name */}
              <CardTitle className="text-xl font-semibold">
                {project.name}
              </CardTitle>

              {/* Created At */}
              <p className="text-xs text-muted-foreground">
                Created on {formattedDate}
              </p>

              {/* Description */}
              <CardDescription className="line-clamp-2">
                {project.description}
              </CardDescription>

              {/* Feature Count */}
              <Badge variant="secondary" className="w-fit mt-2">
                {project.featureCount} Features
              </Badge>
            </CardHeader>

            <CardFooter>
              <Button asChild className="w-full">
                <Link
                  to="/dashboard/$projectId"
                  params={{ projectId: project.id }}
                >
                  View Project
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
