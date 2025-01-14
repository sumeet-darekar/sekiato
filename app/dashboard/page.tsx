import { Metadata } from "next";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { VulnerabilityOverview } from "@/components/dashboard/vulnerability-overview";
import { RecentScans } from "@/components/dashboard/recent-scans";
import { ProjectStats } from "@/components/dashboard/project-stats";

export const metadata: Metadata = {
  title: "Dashboard - Sekiato",
  description: "Monitor and manage your project vulnerabilities",
};

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        description="Monitor your projects and security status"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ProjectStats />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <VulnerabilityOverview className="col-span-4" />
        <RecentScans className="col-span-3" />
      </div>
    </DashboardShell>
  );
}