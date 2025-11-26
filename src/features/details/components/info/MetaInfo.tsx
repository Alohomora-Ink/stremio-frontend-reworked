"use client";

import Link from "next/link";
import { RouteBuilder } from "@/lib/route-builder";
import type { MetaItem } from "@/stremio-core-ts-wrapper/src/types/models/meta-item";

interface Props {
  meta: MetaItem;
}

export function MetaInfo({ meta }: Props) {
  const genres =
    meta.genres ||
    meta.links?.filter((l) => l.category === "genre").map((l) => l.name) ||
    [];
  const directors =
    meta.director ||
    meta.links?.filter((l) => l.category === "director").map((l) => l.name) ||
    [];

  return (
    <div className="glass-panel grid grid-cols-1 gap-x-12 gap-y-8 rounded-2xl p-8 sm:grid-cols-2 md:grid-cols-3">
      {/* Genres */}
      {genres.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-label">Genres</h3>
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <Link
                key={g}
                href={RouteBuilder.toGenre(meta.type, g)}
                className="hover:border-brand-primary/50 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300 transition-colors hover:text-white"
              >
                {g}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Directors */}
      {directors.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-label">Director</h3>
          <div className="flex flex-col gap-1">
            {directors.map((d) => (
              <Link
                key={d}
                href={RouteBuilder.toSearch(d)}
                className="hover:text-brand-primary text-sm font-medium text-zinc-200 hover:underline"
              >
                {d}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="flex flex-col gap-3">
        <h3 className="text-label">Info</h3>
        <div className="space-y-1 text-sm text-zinc-300">
          {meta.country && (
            <p>
              <span className="text-zinc-500">Country:</span> {meta.country}
            </p>
          )}
          {meta.status && (
            <p>
              <span className="text-zinc-500">Status:</span> {meta.status}
            </p>
          )}
          {meta.awards && (
            <p>
              <span className="text-zinc-500">Awards:</span> {meta.awards}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
