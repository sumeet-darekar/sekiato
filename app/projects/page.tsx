import React from "react";
import { Metadata } from "next";
import { ProjectList } from "../../components/projects/project-list";
import { DashboardHeader } from "../../components/dashboard/header";
import { DashboardShell } from "../../components/dashboard/shell";
import { NewProjectButton } from "../../components/projects/new-project-button";

export const metadata: Metadata = {
  title: "Projects - Sekiato",
  description: "secure your projects with Sekiato",
};

export default function ProjectsPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Projects"
        description="Manage and scan "
      >
        <NewProjectButton />
      </DashboardHeader>
      <ProjectList />
    </DashboardShell>
  );
}