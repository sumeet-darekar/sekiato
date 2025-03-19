"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import { Bell } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <ModeToggle />
          <UserNav />
        </div>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  );
}