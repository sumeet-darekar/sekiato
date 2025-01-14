"use client";


import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Trash2, Code } from "lucide-react";
import { useEffect, useState } from "react";
import { getProjects } from "@/app/actions/projects";

interface Project {
  id: string;
  name: string;
  repository: string;
  lastScan: string;
  status: string;
  issues: number;
  code?: string;
}

const initialProjects = [
  {
    id: "1",
    name: "Frontend App",
    repository: "org/frontend-app",
    lastScan: "2 hours ago",
    status: "healthy",
    issues: 2,
  },
  {
    id: "2",
    name: "Backend API",
    repository: "org/backend-api",
    lastScan: "1 day ago",
    status: "critical",
    issues: 8,
  },
];

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    async function loadProjects() {
      const dbProjects = await getProjects();
      setProjects(dbProjects.map(project => ({
        ...project,
        lastScan: project.lastScan ? new Date(project.lastScan).toLocaleString() : 'Never',
        status: project.status || 'unknown',
        issues: project.issues || 0,
        code: project.code || '',
      })));
    }
    loadProjects();
  }, []);
  // Add this function to handle new projects
  window.addProject = (name: string, code: string) => {
    const newProject = {
      id: Date.now().toString(),
      name,
      repository: "local/file",
      lastScan: "Just now",
      status: "pending",
      issues: 0,
      code,
    };
    setProjects(prev => [newProject, ...prev]);
  };

  return (
    <div className="space-y-4">
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Repository</TableHead>
              <TableHead>Last Scan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>{project.repository}</TableCell>
                <TableCell>{project.lastScan}</TableCell>
                <TableCell>
                  <Badge
                    variant={project.status === "critical" ? "destructive" : "secondary"}
                  >
                    {project.issues} issues
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => setSelectedProject(project)}
                      disabled={!project.code}
                    >
                      <Code className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {selectedProject?.code && (
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Code Preview: {selectedProject.name}</h3>
            <Button variant="ghost" onClick={() => setSelectedProject(null)}>
              Close
            </Button>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <pre className="overflow-auto max-h-[500px] text-sm font-mono whitespace-pre-wrap">
              {selectedProject.code}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
}