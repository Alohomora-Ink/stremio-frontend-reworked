"use client";

import { useState } from "react";
import { User, LogIn, LogOut } from "lucide-react";
import { useCtx, useAuthActions } from "@/stremio-core-ts-wrapper/src";
import { AuthModal } from "@/features/auth/components/AuthModal";

export function UserProfileIcon() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, profile } = useCtx();
  const { logout } = useAuthActions();

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <div className="group relative z-50 flex flex-col items-end pb-4">
        {/* Avatar Trigger */}
        <button className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-zinc-900/40 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-white/10">
          {isAuthenticated && profile?.avatar ? (
            <img
              // src={profile.avatar}
              src={
                "https://i.pinimg.com/1200x/85/bf/20/85bf207a487304a031781c4bf20b9a3a.jpg"
              }
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <User className="h-5 w-5" />
          )}
        </button>

        {/* Dropdown Menu */}
        <div className="pointer-events-none absolute top-full right-0 w-64 origin-top-right scale-95 transform rounded-xl border border-white/10 bg-zinc-900/90 p-1 opacity-0 shadow-2xl backdrop-blur-xl transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
          {isAuthenticated ? (
            // LOGGED IN STATE
            <div className="p-1">
              <div className="mb-1 border-b border-white/5 px-3 py-3">
                <p className="truncate text-sm font-medium text-white">
                  {profile?.email || "No Email"}
                </p>
              </div>
              <button
                onClick={() => logout()}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            // GUEST STATE
            <div className="p-1">
              <div className="mb-1 px-3 py-2">
                <p className="text-xs leading-relaxed text-zinc-400">
                  Sign in to sync your library and addons across devices.
                </p>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex w-full items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
