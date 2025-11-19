"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PosterProps {
  src?: string;
  title: string;
  info?: string;
  className?: string;
  onClick?: () => void;
}

export function Poster({ src, title, info, className, onClick }: PosterProps) {
  const [error, setError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("relative group cursor-pointer shrink-0", className)}
      onClick={onClick}
    >
      <div className="relative aspect-2/3 rounded-xl overflow-hidden bg-zinc-800 border border-white/5 shadow-xl ring-1 ring-white/5 group-hover:ring-white/20 transition-all duration-300">
        {!src || error ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 p-2 bg-zinc-900/80">
            <ImageOff className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-[10px] text-center leading-tight line-clamp-2">
              {title}
            </span>
          </div>
        ) : (
          <img
            src={src}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setError(true)}
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 drop-shadow-md">
            {title}
          </h3>
          {info && (
            <p className="text-zinc-300 text-xs mt-0.5 font-medium">{info}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
