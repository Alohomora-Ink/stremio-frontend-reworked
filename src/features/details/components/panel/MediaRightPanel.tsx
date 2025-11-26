"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EpisodeList } from "./EpisodeList";
import { StreamListContainer } from "../streams/StreamListContainer";
import type {
  MetaItem,
  MetaVideo
} from "@/stremio-core-ts-wrapper/src/types/models/meta-item";

interface MediaRightPanelProps {
  meta: MetaItem;
}

export function MediaRightPanel({ meta }: MediaRightPanelProps) {
  const isSeries = meta.type === "series" || meta.type === "anime";
  const [activeEpisode, setActiveEpisode] = useState<MetaVideo | null>(null);

  // --- MOVIE VIEW ---
  // Movies don't have episodes, so we don't pass the episode prop.
  if (!isSeries) {
    return (
      <div className="flex w-[450px] shrink-0 flex-col border-l border-white/5 bg-black/40 backdrop-blur-xl">
        <StreamListContainer type={meta.type} meta={meta} />
      </div>
    );
  }

  // --- SERIES VIEW ---
  return (
    <div className="relative flex w-[450px] shrink-0 flex-col overflow-hidden border-l border-white/5 bg-black/40 backdrop-blur-xl">
      <AnimatePresence
        initial={false}
        mode="popLayout"
        custom={activeEpisode ? 1 : -1}
      >
        {/* STATE 1: EPISODE LIST (Default) */}
        {!activeEpisode ? (
          <motion.div
            key="episode-list"
            className="absolute inset-0 h-full w-full"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-30%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <EpisodeList
              meta={meta}
              onEpisodeSelect={(ep) => setActiveEpisode(ep)}
            />
          </motion.div>
        ) : (
          /* STATE 2: STREAM LIST (Active Episode) */
          <motion.div
            key="stream-list"
            className="absolute inset-0 z-10 h-full w-full bg-[#050505]"
            initial={{ x: "100%", boxShadow: "-10px 0 20px rgba(0,0,0,0.5)" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <StreamListContainer
              type={meta.type}
              meta={meta}
              episode={activeEpisode || undefined}
              onBack={() => setActiveEpisode(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
