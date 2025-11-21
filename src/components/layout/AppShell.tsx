"use client";

import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { UserProfileIcon } from "./UserProfileIcon";
import { GlobalSearchIcon } from "./GlobalSearchIcon";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-[#050505] text-zinc-100 selection:bg-purple-500/30">
      {/* 1. Ambient Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[800px] w-[800px] animate-pulse rounded-full bg-purple-900/10 mix-blend-screen blur-[120px] duration-[10s]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[600px] w-[600px] animate-pulse rounded-full bg-blue-900/10 mix-blend-screen blur-[100px] duration-[7s]" />
      </div>

      {/* 2. Chrome Layer (Sidebar & Top Right Tools) */}
      <Sidebar />

      {/* Top Right Controls Container */}
      <div className="fixed top-6 right-6 z-50 flex items-start gap-3">
        <GlobalSearchIcon />
        <UserProfileIcon />
      </div>

      {/* 3. The Stage (Main Content Area) */}
      <main className="custom-scrollbar relative z-10 h-full w-full flex-1 overflow-x-hidden overflow-y-auto">
        <div className="pointer-events-none fixed inset-0 z-40 h-full w-full">
          <div className="absolute top-0 bottom-0 left-0 w-32 bg-linear-to-r from-[#050505] via-[#050505]/80 to-transparent" />
          <div className="absolute top-0 right-0 bottom-0 w-24 bg-linear-to-l from-[#050505] to-transparent" />
          <div className="absolute top-0 right-0 left-0 h-32 bg-linear-to-b from-[#050505] via-[#050505]/80 to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 h-32 bg-linear-to-t from-[#050505] to-transparent" />
        </div>

        <div className="relative z-0 min-h-screen w-full pt-32 pr-8 pb-32 pl-24 md:pr-16 md:pl-32">
          {children}
        </div>
      </main>
    </div>
  );
}
