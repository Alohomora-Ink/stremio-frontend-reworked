"use client";

import type { MetaItem } from "@stremio/stremio-core-web";
import Image from "next/image";

interface BoardCatalogStackProps {
  title: string;
  items: MetaItem[];
}

export function BoardCatalogStack({ title, items }: BoardCatalogStackProps) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer transition-transform hover:scale-105"
          >
            <div className="relative aspect-2/3 bg-zinc-800 rounded-lg overflow-hidden">
              {item.poster ? (
                <img
                  src={item.poster}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  No Poster
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-semibold text-sm line-clamp-2">
                    {item.name}
                  </h3>
                  {item.releaseInfo && (
                    <p className="text-zinc-300 text-xs mt-1">
                      {item.releaseInfo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
