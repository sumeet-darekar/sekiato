"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecentScansProps {
  className?: string;
}

const recentScans = [
  {
    project: "Frontend App",
    timestamp: "2 hours ago",
    status: "completed",
    issues: 12,
  },
  {
    project: "API Service",
    timestamp: "5 hours ago",
    status: "completed",
    issues: 3,
  },
  {
    project: "Mobile App",
    timestamp: "1 day ago",
    status: "completed",
    issues: 8,
  },
];

export function RecentScans({ className }: RecentScansProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Scans</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentScans.map((scan) => (
            <div key={scan.project} className="flex items-center">
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">
                  {scan.project}
                </p>
                <p className="text-sm text-muted-foreground">
                  {scan.timestamp}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={scan.issues > 5 ? "destructive" : "secondary"}>
                  {scan.issues} issues
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}