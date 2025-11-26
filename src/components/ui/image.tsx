"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ImageOff, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

export function SmartImage({
  src,
  alt,
  className,
  fallbackText,
  ...props
}: ImageProps) {
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Logic:
  const proxiedSrc = useMemo(() => {
    // TS Fix: Guard against undefined or Blob types
    if (!src || typeof src !== "string") return undefined;

    // TS Fix: Now src is narrowed to 'string' so .includes and .startsWith work
    if (src.includes("linvo.com") || src.includes("avatar.png")) {
      return undefined;
    }

    if (src.startsWith("data:")) return src;

    const retryParam =
      retryCount > 0 ? `&retry=${retryCount}-${Date.now()}` : "";

    if (src.startsWith("/")) return src;

    // TS Fix: encodeURIComponent requires string (which we established above)
    return `/api/image-proxy?url=${encodeURIComponent(src)}${retryParam}`;
  }, [src, retryCount]);

  const handleError = () => {
    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000;
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
      }, delay);
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    setError(false);
    setRetryCount(0);
  }, [src]);

  // Check 'src' here too to handle the initial undefined/null case
  if (!src || typeof src !== "string" || error || !proxiedSrc) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center bg-zinc-900 text-zinc-700",
          className
        )}
      >
        {className?.includes("rounded-full") ? (
          <User className="h-1/3 w-1/3 opacity-50" />
        ) : (
          <ImageOff className="h-1/3 w-1/3 opacity-50" />
        )}

        {fallbackText && (
          <span className="mt-2 px-1 text-center text-[10px] font-medium tracking-wider uppercase">
            {fallbackText}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      key={retryCount}
      src={proxiedSrc}
      alt={alt}
      className={cn("duration-normal transition-opacity", className)}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
}
