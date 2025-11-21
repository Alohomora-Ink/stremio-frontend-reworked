"use client";

import { LiquidGlassSplash } from "../primitives/glass/LiquidGlassSplash";
import { Loader2, LogIn, LogOut } from "lucide-react";

export type AuthTransitionType = "login" | "logout" | null;

interface AuthTransitionProps {
  type: AuthTransitionType;
}

export function AuthTransition({ type }: AuthTransitionProps) {
  const isLogin = type === "login";

  return (
    <LiquidGlassSplash isVisible={!!type}>
      <div className="flex flex-col items-center gap-6 p-8 text-center">
        {/* Icon Container */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          {isLogin ? (
            <LogIn className="h-10 w-10 text-blue-400" />
          ) : (
            <LogOut className="h-10 w-10 pl-1 text-red-400" />
          )}
          {/* Orbiting Loader */}
          <div className="absolute inset-0 animate-spin rounded-full border-t border-white/30 duration-1000" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {isLogin ? "Welcome Back" : "Signing Out"}
          </h2>
          <p className="text-sm font-medium text-zinc-400">
            {isLogin
              ? "Syncing your library and preferences..."
              : "Cleaning up session data..."}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-1.5">
          <Loader2 className="h-3 w-3 animate-spin text-zinc-500" />
          <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
            Reloading Application
          </span>
        </div>
      </div>
    </LiquidGlassSplash>
  );
}
