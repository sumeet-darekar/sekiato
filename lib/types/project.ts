export type ProjectStatus = 'pending' | 'scanning' | 'completed' | 'failed';

export interface CreateProjectData {
  name: string;
  code: string;
  repository: string;
}

export interface Project {
  id: string;
  name: string;
  repository: string;
  code: string | null;
  lastScan: Date | null;
  status: ProjectStatus;
  issues: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProjectWithCode = Project & {
  code: string;
};

export type ProjectSummary = Omit<Project, 'code'>;


export interface Vulnerability {
  id: string;
  projectId: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  code: string;
  location: string;
  status: 'open' | 'closed';
  createdAt: Date;
}