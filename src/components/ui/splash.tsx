"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SplashProps {
  isVisible: boolean;
  children: ReactNode;
  className?: string;
}

export function Splash({ isVisible, children, className }: SplashProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={cn(
            "fixed inset-0 z-100 flex items-center justify-center bg-[#050505]/60",
            className
          )}
        >
          {/* Ambient Orbs */}
          <div className="bg-brand-secondary/20 absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full blur-[120px]" />
          <div
            className="bg-brand-primary/20 absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full blur-[120px]"
            style={{ animationDelay: "1s" }}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="relative z-10 flex flex-col items-center"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
