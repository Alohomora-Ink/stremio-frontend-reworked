"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: React.ReactNode;
  className?: string;
  extraRightPadding?: number;
  activeItemId?: string | null;
}

export function Carousel({
  children,
  className,
  extraRightPadding = 0,
  activeItemId
}: CarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  // Scroll Check Logic
  const checkScroll = React.useCallback(() => {
    if (!scrollRef.current) return;
    requestAnimationFrame(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    });
  }, []);

  React.useEffect(() => {
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
  }, [checkScroll, children]);

  // Active Item Scroll Logic
  React.useEffect(() => {
    if (!activeItemId || !scrollRef.current) return;
    const container = scrollRef.current;

    requestAnimationFrame(() => {
      const activeNode = container.querySelector(
        `[data-item-id="${activeItemId}"]`
      ) as HTMLElement;
      if (activeNode) {
        const itemLeft = activeNode.offsetLeft;
        const leftPadding = 180;
        const targetScrollLeft = Math.max(0, itemLeft - leftPadding);
        container.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
      }
    });
  }, [activeItemId]);

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
    <div
      className={cn(
        "group/carousel relative -mr-8 mb-12 -ml-24 md:-mr-16 md:-ml-32",
        className
      )}
    >
      {/* Left Button */}
      <div
        className={cn(
          "duration-normal absolute top-1/2 left-24 z-30 -translate-y-1/2 transition-all md:left-32",
          !canScrollLeft && "pointer-events-none translate-y-4 opacity-0"
        )}
      >
        <button
          onClick={() => scroll("left")}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-md transition-transform hover:scale-110 hover:bg-white/20"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>

      {/* Right Button */}
      <div
        className={cn(
          "duration-normal absolute top-1/2 right-8 z-30 -translate-y-1/2 transition-all md:right-16",
          !canScrollRight && "pointer-events-none translate-y-4 opacity-0"
        )}
        style={{
          right: extraRightPadding
            ? `calc(2rem + ${extraRightPadding}px)`
            : undefined
        }}
      >
        <button
          onClick={() => scroll("right")}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg backdrop-blur-md transition-transform hover:scale-110 hover:bg-white/20"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Track */}
      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth pt-12 pr-8 pb-12 pl-24 md:pr-16 md:pl-32"
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
