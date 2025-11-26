"use client";

import { User } from "lucide-react";
import Link from "next/link";

import { Carousel } from "@/components/ui/carousel"; // NEW
import { SmartImage } from "@/components/ui/image"; // NEW
import { RouteBuilder } from "@/lib/route-builder";

import type { MetaItem } from "@/stremio-core-ts-wrapper/src/types/models/meta-item";

interface Props {
  meta: MetaItem;
}

export function CastList({ meta }: Props) {
  const cast = meta.app_extras?.cast || [];
  if (cast.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-label px-1">Cast</h3>

      {/* Carousel Wrapper */}
      <Carousel>
        {cast.map((actor, idx) => (
          <Link
            key={`${actor.name}-${idx}`}
            href={RouteBuilder.toSearch(actor.name)}
            className="group relative block h-28 w-28 shrink-0"
          >
            <div className="duration-normal relative h-full w-full overflow-hidden rounded-full border border-white/10 bg-zinc-900 shadow-lg transition-all group-hover:scale-110 group-hover:border-white/40">
              {actor.photo ? (
                <SmartImage
                  src={actor.photo}
                  alt={actor.name}
                  className="duration-normal h-full w-full object-cover transition-all group-hover:blur-md group-hover:brightness-40"
                />
              ) : (
                <div className="duration-normal flex h-full w-full items-center justify-center bg-zinc-800 text-zinc-600 transition-all group-hover:blur-md group-hover:brightness-50">
                  <User className="h-10 w-10" />
                </div>
              )}

              {/* Hover Text */}
              <div className="duration-fast pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center p-2 text-center opacity-0 transition-opacity group-hover:opacity-100">
                <p className="line-clamp-2 text-[11px] leading-tight font-bold text-white drop-shadow-lg">
                  {actor.name}
                </p>
                {actor.character && (
                  <p className="mt-1 line-clamp-2 text-[9px] font-medium text-blue-200/90 drop-shadow-md">
                    {actor.character}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </Carousel>
    </div>
  );
}
