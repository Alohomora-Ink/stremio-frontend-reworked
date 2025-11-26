"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void; // We keep this for Escape key, but remove click-outside
  children: React.ReactNode;
  className?: string;
  width?: string | number;
}

export function Drawer({
  isOpen,
  onClose,
  children,
  className,
  width = 450
}: DrawerProps) {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.5
          }}
          className={cn(
            // Removed 'fixed' and z-index to allow it to coexist nicely if needed,
            // but for Sidebar behavior 'fixed' right-0 is correct.
            // We just removed the backdrop div that was here before.
            "fixed top-0 right-0 bottom-0 z-50 h-full border-l border-white/10 bg-[#050505] shadow-2xl",
            className
          )}
          style={{ width }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
