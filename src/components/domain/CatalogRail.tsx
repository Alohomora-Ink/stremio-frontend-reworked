"use client";

import { useRef, useEffect } from "react"; // Added useEffect
import Link from "next/link";
import { ChevronRight, AlertCircle, DatabaseZap } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Carousel } from "@/components/ui/carousel";
import { SectionTitle } from "@/components/ui/typography";
import { SkeletonRail } from "@/components/ui/skeleton";
import { MediaCard } from "@/components/domain/MediaCard";

import { useCatalogContent } from "@/features/board/hooks/use-catalog-content";
import { useOnScreen } from "@/hooks/use-on-screen";
import { useSelection } from "@/hooks/use-selection";

import type { Catalog } from "@/stremio-core-ts-wrapper/src/types/models/catalog";

interface CatalogRailProps {
  catalog: Catalog;
}

export function CatalogRail({ catalog }: CatalogRailProps) {
  const { selectItem, isItemSelected, selection } = useSelection();

  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(containerRef, "200px");
  const uniqueCatalogId = `${catalog.addon.manifest.id}__${catalog.type}__${catalog.id}`;
  const isRailActive = selection?.sourceId === uniqueCatalogId;

  const { items, isLoading, error } = useCatalogContent(
    catalog,
    isVisible || isRailActive
  );

  // VERTICAL SCROLL LOGIC (ROBUST)
  useEffect(() => {
    if (
      isRailActive &&
      containerRef.current &&
      !isLoading &&
      items.length > 0
    ) {
      // We use a double-raf (Request Animation Frame) to wait for the browser paint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          containerRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
          });
        });
      });
    }
  }, [isRailActive, isLoading, items.length]);

  const getDisplayTitle = () => {
    const rawName = catalog.name || catalog.type;
    const typeLabel =
      catalog.type.charAt(0).toUpperCase() + catalog.type.slice(1);
    if (rawName.toLowerCase().includes(catalog.type.toLowerCase()))
      return rawName;
    return `${rawName} ${typeLabel}`;
  };

  const seeMoreUrl = `/discover?addon=${encodeURIComponent(catalog.addon.transportUrl)}&type=${catalog.type}&catalog=${encodeURIComponent(catalog.id)}`;
  const hasError = !!error;
  const isEmpty = !isLoading && !hasError && items.length === 0;

  return (
    <div ref={containerRef} className="mb-2 min-h-[280px]">
      <div className="mb-0 flex items-end justify-start gap-3 px-4 pr-8 pl-2 md:pr-16">
        <div className="flex items-end gap-4">
          <SectionTitle>{getDisplayTitle()}</SectionTitle>
          {hasError && (
            <div className="mb-1 flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-bold tracking-wider text-red-400 uppercase">
              <AlertCircle className="h-3 w-3" />
              <span>Fetch Failed</span>
            </div>
          )}
          {!hasError && !isEmpty && (
            <Link
              href={seeMoreUrl}
              className="group flex items-center gap-1 rounded-full border border-white/5 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:bg-white/10 hover:pr-2 hover:text-white"
            >
              <span>See more</span>
              <ChevronRight className="h-3 w-3 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
            </Link>
          )}
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {isLoading || (!isVisible && items.length === 0) ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonRail variant="default" />
            </motion.div>
          ) : hasError || isEmpty ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <SkeletonRail variant="error" />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Carousel
                // Only pad if THIS rail contains the selection
                extraRightPadding={isRailActive ? 450 + 32 : 0}
                // Only tell Carousel to scroll horizontal if THIS rail is active
                activeItemId={isRailActive ? selection.id : null}
              >
                {items.map((item) => (
                  <MediaCard
                    key={`${item.id}-${uniqueCatalogId}`}
                    item={item}
                    // Specific check: Item ID + Rail ID
                    isActive={isItemSelected(item.id, uniqueCatalogId)}
                    // Pass specific source ID on click
                    onClick={() =>
                      selectItem(item.type, item.id, uniqueCatalogId)
                    }
                  />
                ))}
              </Carousel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
