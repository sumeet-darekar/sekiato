"use client";
import React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, LayoutDashboard, FolderGit2, AlertCircle, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { saveProject } from '@/app/actions/projects'
import type { CreateProjectData } from '@/lib/types/project'

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Projects',
    icon: FolderGit2,
    href: '/projects',
  },
  {
    label: 'Vulnerabilities',
    icon: AlertCircle,
    href: '/vulnerabilities',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-muted/50 border-r w-64 min-w-[250px]">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold ml-2 truncate">Sekiato</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-left",
                pathname === route.href && "bg-secondary"
              )}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="h-5 w-5 min-w-[20px] mr-3" />
                <span className="truncate">{route.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}