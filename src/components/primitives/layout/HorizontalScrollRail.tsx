"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";

import { LiquidGlassNavigationButton } from "../glass/LiquidGlassNavigationButton";

interface HorizontalScrollRailProps {
  children: React.ReactNode;
  className?: string;
  extraRightPadding?: number;
  activeItemId?: string | null;
}

export function HorizontalScrollRail({
  children,
  className,
  extraRightPadding = 0,
  activeItemId
}: HorizontalScrollRailProps) {
  const theme = useTheme().rail;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      checkScroll();
    }
    return () => {
      el?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll, children, extraRightPadding]);

  useEffect(() => {
    if (!activeItemId || !scrollRef.current) return;

    const container = scrollRef.current;
    const activeNode = container.querySelector(
      `[data-item-id="${activeItemId}"]`
    ) as HTMLElement;

    if (activeNode) {
      setTimeout(() => {
        const DESIRED_OFFSET = 130;
        const targetScrollLeft = activeNode.offsetLeft - DESIRED_OFFSET;
        container.scrollTo({
          left: targetScrollLeft,
          behavior: "smooth"
        });
      }, 20);
    }
  }, [activeItemId, extraRightPadding]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  return (
    <div className={cn(theme.container, className)}>
      <div
        className={theme.button.positionLeft}
        onClick={(e) => e.stopPropagation()}
      >
        <LiquidGlassNavigationButton
          direction="left"
          onClick={() => scroll("left")}
          visible={canScrollLeft}
        />
      </div>

      {/* RIGHT BUTTON */}
      <div
        className={theme.button.positionRight}
        style={{
          right: extraRightPadding
            ? `calc(2rem + ${extraRightPadding}px)`
            : undefined,
          transition: "right 0.5s cubic-bezier(0.32, 0.72, 0, 1)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <LiquidGlassNavigationButton
          direction="right"
          onClick={() => scroll("right")}
          visible={canScrollRight}
        />
      </div>

      <div
        ref={scrollRef}
        className={theme.track}
        style={{
          paddingRight: extraRightPadding
            ? `calc(4rem + ${extraRightPadding}px)`
            : undefined
        }}
      >
        {children}
      </div>
    </div>
  );
}
