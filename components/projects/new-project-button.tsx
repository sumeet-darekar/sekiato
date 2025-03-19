"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { saveProject } from "@/app/actions/projects";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";

declare global {
  interface Window {
    addProject: (name: string, code: string) => void;
  }
}

export function NewProjectButton() {
  const [open, setOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (!projectName) {
        setProjectName(file.name.replace(/\.[^/.]+$/, ""));
      }
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const code = e.target?.result as string;
        if (projectName && code) {
          await saveProject({
            name: projectName,
            code: code,
            repository: file.name
          });
          window.addProject?.(projectName, code);
          setOpen(false);
          setProjectName("");
          setFileName("");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>
            Upload a file to create a new project
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.php"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {fileName || "Upload File"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}