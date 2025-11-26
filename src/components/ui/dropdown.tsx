"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/use-click-outside";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  label: React.ReactNode;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
  width?: string;
}

export function Dropdown({
  label,
  icon,
  rightIcon,
  children,
  align = "left",
  className,
  width = "w-56"
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));
  const renderRightIcon = () => {
    if (rightIcon === null) return null;
    if (rightIcon) return rightIcon;
    // Default
    return (
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    );
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold shadow-lg transition-all outline-none active:scale-95",
          isOpen
            ? "border-white/20 bg-zinc-800/80 text-white"
            : "border-white/10 bg-zinc-900/60 text-zinc-300 hover:border-white/20 hover:text-white"
        )}
      >
        <div className="flex items-center truncate">
          {icon}
          <span className="truncate">{label}</span>
        </div>
        {renderRightIcon()}
      </button>

      {/* Menu Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            onWheel={(e) => e.stopPropagation()}
            className={cn(
              "absolute z-9999 mt-2 rounded-xl border border-white/10 p-1 shadow-2xl",
              "bg-[#09090b]/80 backdrop-blur-xl",
              "custom-scrollbar max-h-60 overflow-y-auto overscroll-contain",
              width,
              align === "right" ? "right-0" : "left-0"
            )}
          >
            <div className="flex flex-col gap-0.5">
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  const childElement = child as React.ReactElement<{
                    onClick?: (e: React.MouseEvent) => void;
                  }>;
                  return React.cloneElement(childElement, {
                    onClick: (e: React.MouseEvent) => {
                      childElement.props.onClick?.(e);
                      setIsOpen(false);
                    }
                  });
                }
                return child;
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownItem({
  children,
  isActive,
  onClick,
  className
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full shrink-0 items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors",
        isActive
          ? "bg-white/10 text-white"
          : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="shrink-0 px-3 py-2 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
      {children}
    </div>
  );
}

export function DropdownSeparator() {
  return <div className="mx-1 my-1 h-px shrink-0 bg-white/5" />;
}
