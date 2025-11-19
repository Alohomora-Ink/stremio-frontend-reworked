"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { MetaItem } from "@/stremio-core-ts-wrapper/src";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SmartImage } from "@/components/images/SmartImage";

interface BoardCatalogStackProps {
  title: string;
  items: MetaItem[];
}

export function BoardCatalogStack({ title, items }: BoardCatalogStackProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    requestAnimationFrame(() => {
      if (!scrollContainerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
    });
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      checkScroll();
    }
    return () => el?.removeEventListener("scroll", checkScroll);
  }, [checkScroll, items]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.6;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="group/row relative z-0 mb-4">
      <div className="px-4 md:pl-28 -mb-5 relative z-10 pointer-events-none">
        <h2 className="text-xl font-bold text-white/90 drop-shadow-md inline-block pointer-events-auto">
          {title}
        </h2>
      </div>
      <div className="relative w-full">
        <div
          className={`absolute left-0 top-0 bottom-0 w-24 md:w-32 z-20 flex items-center justify-start pl-4 md:pl-8 transition-opacity duration-500 ${
            showLeft ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-linear-to-r from-[#050505] via-[#050505]/80 to-transparent" />
          <button
            onClick={() => scroll("left")}
            className="relative z-10 p-3 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl text-white hover:bg-white/15 hover:scale-110 hover:border-white/30 transition-all duration-300 active:scale-95"
          >
            <ChevronLeft className="w-6 h-6 drop-shadow-lg" />
          </button>
        </div>
        <div
          className={`absolute right-0 top-0 bottom-0 w-24 md:w-32 z-20 flex items-center justify-end pr-4 transition-opacity duration-500 ${
            showRight ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="absolute inset-0 bg-linear-to-l from-[#050505] via-[#050505]/80 to-transparent" />
          <button
            onClick={() => scroll("right")}
            className="relative z-10 p-3 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl text-white hover:bg-white/15 hover:scale-110 hover:border-white/30 transition-all duration-300 active:scale-95"
          >
            <ChevronRight className="w-6 h-6 drop-shadow-lg" />
          </button>
        </div>
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto py-12 pl-4 md:pl-28 pr-12 scrollbar-hide items-center"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)",
          }}
        >
          {items.map((item) => (
            <div key={item.id} className="flex-none">
              <div className="relative w-[140px] md:w-[170px] aspect-2/3 group/card cursor-pointer transition-all duration-500 ease-out hover:scale-110 hover:z-30 hover:-translate-y-2 origin-center">
                <div className="absolute inset-0 bg-zinc-800/40 rounded-xl overflow-hidden shadow-lg border border-white/5 ring-1 ring-white/5 group-hover/card:ring-white/30 group-hover/card:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500">
                  <SmartImage
                    src={item.poster}
                    alt={item.name}
                    fallbackText={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 pointer-events-none transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 drop-shadow-md translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">
                      {item.name}
                    </h3>
                    {item.releaseInfo && (
                      <p className="text-zinc-300 text-xs mt-1 font-medium translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-75">
                        {item.releaseInfo}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="w-4 flex-none" />
        </div>
      </div>
    </div>
  );
}
