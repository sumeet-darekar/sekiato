"use client";

import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Sidebar from "./sidebar";
import Header from "./header";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn && pathname !== '/sign-in' && pathname !== '/sign-up') {
        router.push('/sign-in');
      }
      if (isSignedIn && (pathname === '/sign-in' || pathname === '/sign-up')) {
        router.push('/');
      }
    }
  }, [isLoaded, isSignedIn, pathname, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {isSignedIn && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isSignedIn && <Header />}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
