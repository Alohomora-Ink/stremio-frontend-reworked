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
  PinOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { icon: Home, label: "Board", href: "/board" },
  { icon: Compass, label: "Discover", href: "/discover" },
  { icon: Library, label: "Library", href: "/library" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: Box, label: "Addons", href: "/addons" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const isVisible = isPinned || isHovered;
  return (
    <>
      <div
        className="fixed left-0 top-0 bottom-0 w-4 z-40"
        onMouseEnter={() => setIsHovered(true)}
      />
      <motion.aside
        initial={false}
        animate={{
          x: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-4 bottom-1/2  translate-y-1/2 z-50 flex flex-col gap-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-2 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col gap-2 relative">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className="relative group">
                <div
                  className={cn(
                    "p-3 rounded-xl transition-all duration-300 flex items-center justify-center relative z-10",
                    isActive
                      ? "text-white"
                      : "text-zinc-500 hover:text-zinc-200",
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-6 h-6",
                      isActive && "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]",
                    )}
                  />
                </div>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-white/10 rounded-xl border border-white/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-lg text-xs font-medium text-white opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl z-50">
                  {item.label}
                </div>
              </Link>
            );
          })}
          <div className="h-px bg-white/10 mx-2 my-1" />
          <button
            onClick={() => setIsPinned(!isPinned)}
            className="p-3 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all flex items-center justify-center relative group"
          >
            {isPinned ? (
              <Pin className="w-5 h-5" />
            ) : (
              <PinOff className="w-5 h-5" />
            )}
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 bg-zinc-900/90 backdrop-blur-md border border-white/10 rounded-lg text-xs font-medium text-white opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl">
              {isPinned ? "Unpin Sidebar" : "Pin Sidebar"}
            </div>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
