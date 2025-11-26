"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import type {
  MetaItem,
  MetaVideo
} from "@/stremio-core-ts-wrapper/src/types/models/meta-item";
import { Toast } from "@/components/ui/toast";

// 1. Define Supported Events (The "API")
export type ToastEvent =
  | { type: "LIBRARY_ADD"; item: MetaItem }
  | { type: "LIBRARY_REMOVE"; item: MetaItem }
  | { type: "NOTIFICATIONS_TOGGLE"; item: MetaItem; enabled: boolean }
  | { type: "SEASON_WATCHED"; item: MetaItem; season: number; watched: boolean }
  | {
      type: "EPISODE_WATCHED";
      item: MetaItem;
      video: MetaVideo;
      watched: boolean;
    }
  | { type: "ERROR"; title: string; message: string };

interface ToastContextType {
  emit: (event: ToastEvent) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  // We store the "rendered" toast data, not the raw event
  const [toasts, setToasts] = useState<any[]>([]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // 2. The Transformer Logic (Centralized formatting)
  const emit = useCallback((event: ToastEvent) => {
    const id = crypto.randomUUID();
    let toastProps: any = { id, onDismiss: dismissToast };

    switch (event.type) {
      case "LIBRARY_ADD":
        toastProps = {
          ...toastProps,
          type: "success",
          title: "Added to Library",
          message: "Synced to your account",
          poster: event.item.poster,
          logo: event.item.logo,
          itemTitle: event.item.name,
          actionPath: `/detail/${event.item.type}/${event.item.id}`
        };
        break;

      case "LIBRARY_REMOVE":
        toastProps = {
          ...toastProps,
          type: "info",
          title: "Removed from Library",
          message: "Removed from your account",
          poster: event.item.poster,
          logo: event.item.logo,
          itemTitle: event.item.name
        };
        break;

      case "NOTIFICATIONS_TOGGLE":
        toastProps = {
          ...toastProps,
          type: event.enabled ? "success" : "warning",
          title: event.enabled ? "Notifications On" : "Notifications Off",
          message: event.enabled
            ? "You will be notified of new episodes"
            : "Updates muted",
          poster: event.item.poster,
          logo: event.item.logo,
          itemTitle: event.item.name
        };
        break;

      case "EPISODE_WATCHED":
        toastProps = {
          ...toastProps,
          type: event.watched ? "success" : "info",
          title: event.watched ? "Episode Watched" : "Marked Unwatched",
          // Rich message: "S1:E5 - Episode Name"
          message: `S${event.video.season || 0}E${event.video.episode || event.video.number} • ${event.video.name || "Unknown"}`,
          poster: event.video.thumbnail || event.item.poster, // Use episode thumb if available
          logo: event.item.logo,
          itemTitle: event.item.name,
          actionPath: `/detail/${event.item.type}/${event.item.id}`
        };
        break;

      case "SEASON_WATCHED":
        toastProps = {
          ...toastProps,
          type: event.watched ? "success" : "info",
          title: event.watched ? "Season Watched" : "Season Reset",
          message:
            event.season === 0
              ? "Specials marked"
              : `Season ${event.season} marked`,
          poster: event.item.poster,
          logo: event.item.logo,
          itemTitle: event.item.name
        };
        break;

      case "ERROR":
        toastProps = {
          ...toastProps,
          type: "error",
          title: event.title,
          message: event.message
        };
        break;
    }

    setToasts((prev) => [...prev, toastProps]);
  }, []);

  return (
    <ToastContext.Provider value={{ emit }}>
      {children}

      {/* Top Left Stack Container */}
      <div className="pointer-events-none fixed top-24 left-8 z-100 flex w-[500px] flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
