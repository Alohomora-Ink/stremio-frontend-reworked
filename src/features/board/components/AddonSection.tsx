"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

import { CatalogSwimlane } from "@/features/board/components/CatalogSwimlane";
import { useTheme } from "@/providers/ThemeProvider";

import type { AddonGroup } from "@/features/board/hooks/use-board-grouping";
interface Props {
  group: AddonGroup;
}

export function AddonSection({ group }: Props) {
  const typography = useTheme().typography;
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative mb-12">
      {/* The Addon Header - Collapsible toggle */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mb-2 flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2 pl-2 transition-colors duration-200 select-none hover:bg-white/5"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsCollapsed(!isCollapsed);
          }
        }}
      >
        <div className="flex h-5 w-5 items-center justify-center rounded bg-white/10">
          <ChevronRight
            className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? "" : "rotate-90"}`}
          />
        </div>
        <h3 className={typography.sectionSubtitle}>{group.addonName}</h3>
      </div>

      {/* Render all catalogs belonging to this addon */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2">
              {group.catalogs.map((catalog, index) => (
                <CatalogSwimlane
                  key={`${catalog.type}-${catalog.id}-${index}`}
                  catalog={catalog}
                  addonName={group.addonName}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
