"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CatalogRail } from "@/components/domain/CatalogRail";
import type { AddonGroup } from "@/features/board/hooks/use-board-grouping";

interface Props {
  group: AddonGroup;
}

export function AddonSection({ group }: Props) {
  return (
    <div className="relative mb-12">
      <AnimatePresence initial={false}>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <div className="flex flex-col gap-2">
            {group.catalogs.map((catalog, index) => (
              <CatalogRail
                key={`${catalog.type}-${catalog.id}-${index}`}
                catalog={catalog}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
