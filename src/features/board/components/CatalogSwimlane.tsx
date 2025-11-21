"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, DatabaseZap } from "lucide-react";
import { useRef } from "react";

import { LiquidGlassCard } from "@/components/primitives/glass/LiquidGlassCard";
import { HorizontalScrollRail } from "@/components/primitives/layout/HorizontalScrollRail";
import { SectionTitle } from "@/components/primitives/layout/SectionTitle";
import { SkeletonRail } from "@/components/primitives/loading/SkeletonRail";
import { useOnScreen } from "@/hooks/use-on-screen";
import { useTheme } from "@/providers/ThemeProvider";

import { BOARD_UI } from "../constants";
import { useBoardInteraction } from "../context/BoardInteractionContext";
import { useCatalogContent } from "../hooks/use-catalog-content";

import type { Catalog } from "@/stremio-core-ts-wrapper/src/types/models/catalog";
interface Props {
  catalog: Catalog;
  addonName: string;
}

export function CatalogSwimlane({ catalog, addonName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(containerRef, "200px");
  const { items, isLoading, error } = useCatalogContent(catalog, isVisible);
  const { selectItem, activeItem, isSwitching } = useBoardInteraction();
  const shouldReservePanelSpace = !!activeItem || isSwitching;

  const getDisplayTitle = () => {
    const rawName = catalog.name || catalog.type;
    const genericNames = ["popular", "top", "featured", "new", "year"];
    if (genericNames.includes(rawName.toLowerCase())) {
      const typeLabel =
        catalog.type.charAt(0).toUpperCase() + catalog.type.slice(1);
      return `${rawName} ${typeLabel}`;
    }
    return rawName;
  };
  const typography = useTheme().typography;
  const hasError = !!error;
  const isEmpty = !isLoading && !hasError && items.length === 0;
  const showRedSkeleton = hasError || isEmpty;

  return (
    <div ref={containerRef} className="mb-2 min-h-[280px]">
      <div className="mb-0 flex items-end gap-4 px-4 pl-2">
        <SectionTitle title={getDisplayTitle()} />

        <div className="mb-2 flex items-center gap-2 px-4 pl-2"></div>
        {hasError && (
          <div className="mb-1 flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-bold tracking-wider text-red-400 uppercase">
            <AlertCircle className="h-3 w-3" />
            <span>Fetch Failed</span>
          </div>
        )}
        {isEmpty && (
          <div className="mb-1 flex items-center gap-1.5 rounded-full border border-zinc-500/20 bg-zinc-500/10 px-3 py-1 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
            <DatabaseZap className="h-3 w-3" />
            <span>No Content</span>
          </div>
        )}
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {isLoading || !isVisible ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ opacity: 1, transform: "none" }}
            >
              <SkeletonRail variant="default" />
            </motion.div>
          ) : showRedSkeleton ? (
            <motion.div
              key="error-skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{ opacity: 1, transform: "none" }}
            >
              <SkeletonRail variant="error" />
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
                  const isActive = activeItem?.id === item.id;
                  return (
                    <div key={`${item.id}-${idx}`} data-item-id={item.id}>
                      <LiquidGlassCard
                        key={`${item.id}-${idx}`}
                        title={item.name}
                        image={item.poster}
                        subtitle={item.releaseInfo}
                        className={`rounded-2xl transition-all duration-300 ${
                          isActive
                            ? "z-10 scale-105 shadow-[0_0_30px_rgba(59,130,246,0.4)] ring-2 ring-blue-500"
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
