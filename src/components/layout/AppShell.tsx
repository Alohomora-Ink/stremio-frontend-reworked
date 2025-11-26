"use client";

import { usePathname } from "next/navigation";
import { GlobalSearchIcon } from "./GlobalSearchIcon";
import { Sidebar } from "./Sidebar";
import { UserProfileIcon } from "./UserProfileIcon";
import { MediaDrawer } from "@/components/domain/MediaDrawer"; // NEW
import { useScrollController } from "@/providers/ScrollControllerProvider";
import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isDetailView = pathname.startsWith("/detail");
  const { scrollRef } = useScrollController();

  if (isDetailView) {
    return (
      <div className="selection:bg-brand-primary/30 relative h-screen w-screen overflow-hidden bg-(--background) text-zinc-100">
        {children}
      </div>
    );
  }

  return (
    <div className="selection:bg-brand-primary/30 relative flex h-screen w-screen overflow-hidden bg-(--background) text-zinc-100">
      {/* 1. Ambient Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="bg-brand-secondary/10 absolute top-[-10%] left-[-10%] h-[800px] w-[800px] animate-pulse rounded-full mix-blend-screen blur-[120px]"
          style={{ animationDuration: "10s" }}
        />
        <div
          className="bg-brand-primary/10 absolute right-[-10%] bottom-[-10%] h-[600px] w-[600px] animate-pulse rounded-full mix-blend-screen blur-[100px]"
          style={{ animationDuration: "7s" }}
        />
      </div>

      {/* 2. Chrome Layer */}
      <Sidebar />

      <div className="fixed top-6 right-6 z-50 flex items-start gap-3">
        <GlobalSearchIcon />
        <UserProfileIcon />
      </div>

      {/* 3. The Stage */}
      <main
        ref={scrollRef as React.RefObject<HTMLDivElement>}
        className="scrollbar-hide relative z-10 h-full w-full flex-1 overflow-x-hidden overflow-y-auto"
      >
        <div className="pointer-events-none fixed inset-0 z-40 h-full w-full">
          <div className="absolute top-0 bottom-0 left-0 w-32 bg-linear-to-r from-(--background) via-(--background)/80 to-transparent" />
          <div className="bg-linear-to-lrfrom-(--background)o-transparent absolute top-0 right-0 bottom-0 w-24" />
          <div className="bg-linear-to-brfrom-(--background)ia-[via-(--background)/80ransparent absolute top-0 right-0 left-0 h-32" />
          <div className="absolute right-0 bottom-0 left-0 h-32 bg-linear-to-t from-(--background) to-transparent" />
        </div>

        <div className="relative z-0 min-h-screen w-full pt-32 pr-8 pb-32 pl-24 md:pr-16 md:pl-32">
          {children}
        </div>
      </main>

      {/* 4. Global Drawer (Overlay) */}
      <MediaDrawer />
    </div>
  );
}
