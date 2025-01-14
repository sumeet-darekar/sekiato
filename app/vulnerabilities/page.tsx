import { Metadata } from "next";
import { VulnerabilityList } from "@/components/vulnerabilities/vulnerability-list";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { VulnerabilityFilters } from "@/components/vulnerabilities/vulnerability-filters";

export const metadata: Metadata = {
  title: "Vulnerabilities - Sekiato",
  description: "Review and manage detected vulnerabilities",
};

export default function VulnerabilitiesPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Vulnerabilities"
        description="Review and fix security issues"
      />
      <VulnerabilityFilters />
      <VulnerabilityList />
    </DashboardShell>
  );
}