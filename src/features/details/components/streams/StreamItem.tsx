"use client";

import type { ParsedStream } from "@/stremio-core-ts-wrapper/src/types/parsed/parsed-stream";
import { HardDrive, Wifi, Server, FileBox } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreamItemProps {
  stream: ParsedStream;
  onPlay: () => void;
}

export function StreamItem({ stream, onPlay }: StreamItemProps) {
  const { filename, tags, seeders, sizeDisplay, provider, score } =
    stream._parsed;

  // Dynamic Border based on Score/Quality
  const borderColor =
    tags.quality === "4k"
      ? "group-hover:border-yellow-500/40"
      : "group-hover:border-white/20";

  return (
    <button
      onClick={onPlay}
      className={cn(
        "group relative flex w-full flex-col gap-2.5 overflow-hidden rounded-xl border border-zinc-800/60 bg-[#080808] p-3.5 text-left transition-all",
        borderColor,
        "hover:scale-[1.005] hover:bg-[#0f0f0f] hover:shadow-xl"
      )}
    >
      {/* Filename (Top) */}
      <div className="flex w-full items-start justify-between gap-4">
        <div className="line-clamp-2 font-mono text-sm leading-snug font-medium break-all text-zinc-300 transition-colors group-hover:text-white">
          {filename}
        </div>
        {/* Score Badge (Debug or Pro Feature) */}
        {/* <div className="text-[9px] font-mono text-zinc-700">{Math.round(score)}</div> */}
      </div>

      {/* Meta Row */}
      <div className="flex items-center gap-3 text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Server className="h-3 w-3" />
          <span>{provider}</span>
        </div>
        <div className="h-3 w-px bg-white/5" />
        <div className="flex items-center gap-1.5">
          <HardDrive className="h-3 w-3" />
          <span>{sizeDisplay}</span>
        </div>
        <div className="h-3 w-px bg-white/5" />
        <div
          className={cn(
            "flex items-center gap-1.5",
            seeders > 20 ? "text-emerald-500" : "text-yellow-500"
          )}
        >
          <Wifi className="h-3 w-3" />
          <span>{seeders}</span>
        </div>
      </div>

      {/* Tag Cloud */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {/* Quality */}
        {tags.quality && <Tag text={tags.quality} theme="yellow" />}

        {/* HDR */}
        {tags.hdr.map((t) => (
          <Tag key={t} text={t} theme="orange" />
        ))}

        {/* Audio */}
        {tags.audio.map((t) => (
          <Tag key={t} text={t} theme="pink" />
        ))}

        {/* Codec */}
        {tags.codec.map((t) => (
          <Tag key={t} text={t} theme="blue" />
        ))}

        {/* Source */}
        {tags.source && <Tag text={tags.source} theme="zinc" />}

        {/* Languages */}
        {tags.languages.map((t) => (
          <Tag key={t} text={t} theme="green" />
        ))}
      </div>
    </button>
  );
}

function Tag({ text, theme }: { text: string; theme: string }) {
  const styles = {
    yellow: "text-yellow-400 bg-yellow-900/10 border-yellow-500/20",
    orange: "text-orange-400 bg-orange-900/10 border-orange-500/20",
    pink: "text-pink-400 bg-pink-900/10 border-pink-500/20",
    blue: "text-blue-400 bg-blue-900/10 border-blue-500/20",
    green: "text-emerald-400 bg-emerald-900/10 border-emerald-500/20",
    zinc: "text-zinc-400 bg-zinc-900 border-zinc-700"
  };
  const style = styles[theme as keyof typeof styles] || styles.zinc;

  return (
    <span
      className={cn(
        "rounded border px-1.5 py-0.5 text-[9px] font-bold tracking-wide uppercase",
        style
      )}
    >
      {text}
    </span>
  );
}
