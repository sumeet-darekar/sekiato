"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle, GitFork } from "lucide-react";

const stats = [
  {
    title: "Total Projects",
    value: "12",
    icon: GitFork,
    description: "Active repositories",
  },
  {
    title: "Critical Issues",
    value: "9",
    icon: AlertTriangle,
    description: "Across all projects",
  },
  {
    title: "Total Scans",
    value: "482",
    icon: Shield,
    description: "Last 30 days",
  },
  {
    title: "Resolved",
    value: "89%",
    icon: CheckCircle,
    description: "Resolution rate",
  },
];

export function ProjectStats() {
  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}