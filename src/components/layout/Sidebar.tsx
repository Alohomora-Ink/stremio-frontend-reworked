"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Library,
  Calendar,
  Settings,
  Box,
  Pin,
  PinOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { icon: Home, label: "Board", href: "/board" },
  { icon: Compass, label: "Discover", href: "/discover" },
  { icon: Library, label: "Library", href: "/library" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: Box, label: "Addons", href: "/addons" },
  { icon: Settings, label: "Settings", href: "/settings" }
];

export function Sidebar() {
  const pathname = usePathname();
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isVisible = isPinned || isHovered;

  return (
    <>
      {/* Hover Trigger Zone */}
      <div
        className="fixed top-0 bottom-0 left-0 z-40 w-4"
        onMouseEnter={() => setIsHovered(true)}
      />

      <motion.aside
        initial={false}
        animate={{ x: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-1/2 left-4 z-50 flex translate-y-1/2 flex-col gap-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Glass Container */}
        <div className="glass-panel relative flex flex-col gap-2 rounded-2xl p-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className="group relative">
                <div
                  className={cn(
                    "duration-fast relative z-10 flex items-center justify-center rounded-xl p-3 transition-all",
                    isActive
                      ? "text-white"
                      : "text-zinc-500 hover:text-zinc-200"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-6 w-6",
                      isActive && "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    )}
                  />
                </div>

                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl border border-white/5 bg-white/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Tooltip */}
                <div className="duration-fast glass-panel pointer-events-none absolute top-1/2 left-full z-50 ml-4 -translate-x-2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-xl transition-all group-hover:translate-x-0 group-hover:opacity-100">
                  {item.label}
                </div>
              </Link>
            );
          })}

          <div className="mx-2 my-1 h-px bg-white/10" />

          <button
            onClick={() => setIsPinned(!isPinned)}
            className="group relative flex items-center justify-center rounded-xl p-3 text-zinc-500 transition-all hover:bg-white/5 hover:text-zinc-200"
          >
            {isPinned ? (
              <Pin className="h-5 w-5" />
            ) : (
              <PinOff className="h-5 w-5" />
            )}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
