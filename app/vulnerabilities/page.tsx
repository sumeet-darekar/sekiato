"use client";

import { VulnerabilityList } from "@/components/vulnerabilities/vulnerability-list";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { VulnerabilityFilters } from "@/components/vulnerabilities/vulnerability-filters";
import { Button } from "@/components/ui/button";

export default function VulnerabilitiesPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Vulnerabilities"
        description="Review and fix security issues"
      >
        <Button onClick={() => window.open('/api/vulnerabilities/report')}>
          Download Report
        </Button>
      </DashboardHeader>
      <VulnerabilityFilters />
      <VulnerabilityList />
    </DashboardShell>
  );
}
