"use client";

import { AnimatePresence, motion } from "framer-motion";
import { History } from "lucide-react";
import { useRef } from "react";

import { LiquidProgressCard } from "@/components/primitives/glass/LiquidProgressCard";
import { HorizontalScrollRail } from "@/components/primitives/layout/HorizontalScrollRail";
import { SectionTitle } from "@/components/primitives/layout/SectionTitle";
import { SkeletonRail } from "@/components/primitives/loading/SkeletonRail";
import { useOnScreen } from "@/hooks/use-on-screen";
import { useCtx } from "@/stremio-core-ts-wrapper/src";

import { BOARD_UI } from "../constants";
import { useBoardInteraction } from "../context/BoardInteractionContext";
import { useContinueWatching } from "../hooks/use-continue-watching";

export function ContinueWatchingRow() {
  const { isAuthenticated } = useCtx();
  const { selectItem, activeItem, isSwitching } = useBoardInteraction();
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReservePanelSpace = !!activeItem || isSwitching;
  const isVisible = useOnScreen(containerRef, "200px");
  const { items, isLoading } = useContinueWatching(isVisible);

  if (!isAuthenticated) return null;
  if (!isLoading && items.length === 0) return null;

  return (
    <div ref={containerRef} className="mb-8 min-h-[280px]">
      <div className="mb-2 flex items-center gap-3 px-4 pl-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30">
            <History className="h-4 w-4" />
          </div>
          <SectionTitle title="Continue Watching" />
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SkeletonRail />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <HorizontalScrollRail
                extraRightPadding={
                  shouldReservePanelSpace ? BOARD_UI.PANEL_WIDTH + 32 : 0
                }
                activeItemId={activeItem?.id}
              >
                {items.map((item, idx) => {
                  const itemId = item._id || item.id;
                  const isActive = activeItem?.id === itemId;

                  return (
                    <div key={`${itemId}-${idx}`} data-item-id={itemId}>
                      <LiquidProgressCard
                        key={`${itemId}-${idx}`}
                        title={item.name}
                        image={item.poster}
                        progress={item.progress}
                        subtitle={`Resume ${item.type}`}
                        className={`rounded-2xl transition-all duration-300 ${
                          isActive
                            ? "z-10 scale-105 shadow-[0_0_30px_rgba(59,130,246,0.4)] ring-2 ring-blue-500 grayscale-0"
                            : "active:scale-95"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectItem(item);
                        }}
                      />
                    </div>
                  );
                })}
              </HorizontalScrollRail>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
