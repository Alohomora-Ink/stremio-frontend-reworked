"use client";

import React, { useState } from "react";
import { ImageOff } from "lucide-react";

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  fallbackText?: string;
}

export function SmartImage({
  src,
  alt,
  className,
  fallbackText,
  ...props
}: SmartImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-zinc-900 text-zinc-700 ${className}`}
      >
        <ImageOff className="w-1/3 h-1/3 opacity-50" />
        {fallbackText && (
          <span className="text-[10px] mt-2 text-center px-1">
            {fallbackText}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`transition-opacity duration-500 ${className}`}
      onError={() => setError(true)}
      loading="lazy"
      {...props}
    />
  );
}
