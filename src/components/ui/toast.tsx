"use client";

import { motion } from "framer-motion";
import { X, ArrowRight, Check, AlertTriangle, Info, Bell } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SmartImage } from "./image";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  poster?: string;
  logo?: string;
  itemTitle?: string;
  actionPath?: string;
  onDismiss: (id: string) => void;
  duration?: number;
}

const typeConfig = {
  success: {
    icon: Check,
    color: "text-green-400",
    border: "border-green-500/30",
    bg: "bg-green-500/10"
  },
  error: {
    icon: AlertTriangle,
    color: "text-red-400",
    border: "border-red-500/30",
    bg: "bg-red-500/10"
  },
  info: {
    icon: Info,
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10"
  },
  warning: {
    icon: Bell,
    color: "text-yellow-400",
    border: "border-yellow-500/30",
    bg: "bg-yellow-500/10"
  }
};

export function Toast({
  id,
  type = "info",
  title,
  message,
  poster,
  logo,
  itemTitle,
  actionPath,
  onDismiss,
  duration = 5000
}: ToastProps) {
  const router = useRouter();
  const config = typeConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ x: "-100%", opacity: 0, scale: 0.9 }}
      animate={{ x: "0%", opacity: 1, scale: 1 }}
      exit={{ x: "-100%", opacity: 0, scale: 0.9 }}
      className={cn(
        "glass-panel pointer-events-auto relative flex h-32 w-[450px] overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-3xl",
        "group transition-colors hover:border-white/20"
      )}
    >
      <div className="relative w-24 shrink-0 border-r border-white/10 bg-black/50">
        <SmartImage
          src={poster}
          alt="Poster"
          className="h-full w-full object-cover opacity-80"
        />
        <div
          className={cn(
            "absolute bottom-2 left-2 flex h-6 w-6 items-center justify-center rounded-full border shadow-lg backdrop-blur-md",
            config.bg,
            config.border,
            config.color
          )}
        >
          <Icon className="h-3 w-3" />
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-center overflow-hidden px-5 py-3">
        <div className="relative z-10 mb-1 flex h-10 items-center justify-start">
          {logo ? (
            <img
              src={logo}
              alt="Logo"
              className="h-full w-auto object-contain object-left"
            />
          ) : (
            <h4 className="line-clamp-1 text-lg font-black text-white/90">
              {itemTitle || "Notification"}
            </h4>
          )}
        </div>
        <div
          className={cn(
            "relative z-10 mb-0.5 text-[11px] font-bold tracking-wider uppercase",
            config.color
          )}
        >
          {title}
        </div>
        <p className="relative z-10 line-clamp-1 text-xs font-medium text-zinc-400">
          {message}
        </p>
      </div>

      <div className="flex w-14 flex-col border-l border-white/10 bg-white/5 backdrop-blur-sm">
        <button
          onClick={() => onDismiss(id)}
          className="flex flex-1 items-center justify-center text-zinc-500 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        {actionPath && (
          <button
            onClick={() => router.push(actionPath)}
            className="flex flex-1 items-center justify-center border-t border-white/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
