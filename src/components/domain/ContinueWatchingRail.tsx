"use client";

import { useRef, useEffect } from "react";
import { History } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Carousel } from "@/components/ui/carousel";
import { SectionTitle } from "@/components/ui/typography";
import { SkeletonRail } from "@/components/ui/skeleton";
import { MediaCard } from "@/components/domain/MediaCard";

import { useContinueWatching } from "@/features/board/hooks/use-continue-watching";
import { useUserProfileCtx } from "@/stremio-core-ts-wrapper/src";
import { useOnScreen } from "@/hooks/use-on-screen";
import { useSelection } from "@/hooks/use-selection";

export function ContinueWatchingRail() {
  const { selectItem, isItemSelected, selection } = useSelection();
  const { isAuthenticated } = useUserProfileCtx();
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(containerRef, "200px");

  const uniqueRowId = "continue_watching_row";
  const isRailActive = selection?.sourceId === uniqueRowId;

  // Force loading if this rail is the active target
  const { items, isLoading } = useContinueWatching(isVisible || isRailActive);

  // Vertical Scroll Logic
  useEffect(() => {
    if (
      isRailActive &&
      containerRef.current &&
      !isLoading &&
      items.length > 0
    ) {
      containerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, [isRailActive, isLoading, items.length]);

  if (!isAuthenticated) return null;
  if (!isLoading && items.length === 0) return null;

  return (
    <div ref={containerRef} className="mb-8 min-h-[280px]">
      <div className="mb-2 flex items-center gap-3 px-4 pl-2">
        <div className="flex items-center gap-2">
          <div className="bg-brand-secondary/20 text-brand-secondary ring-brand-secondary/30 flex h-8 w-8 items-center justify-center rounded-full ring-1">
            <History className="h-4 w-4" />
          </div>
          <SectionTitle>Continue Watching</SectionTitle>
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
            >
              <SkeletonRail />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Carousel
                extraRightPadding={isRailActive ? 450 + 32 : 0}
                activeItemId={isRailActive ? selection.id : null}
              >
                {items.map((item) => {
                  const itemId = item._id || item.id;
                  return (
                    <MediaCard
                      key={`${itemId}-${uniqueRowId}`}
                      item={item}
                      isActive={isItemSelected(itemId, uniqueRowId)}
                      onClick={() => selectItem(item.type, itemId, uniqueRowId)}
                    />
                  );
                })}
              </Carousel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
