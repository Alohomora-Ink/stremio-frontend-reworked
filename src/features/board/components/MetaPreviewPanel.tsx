"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Award, Clock, Globe, Info, Play, Star, User, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { LiquidGlassButton } from "@/components/primitives/glass/LiquidGlassButton";
import { SmartImage } from "@/components/primitives/media/SmartImage";

import { BOARD_UI } from "../constants";
import { useBoardInteraction } from "../context/BoardInteractionContext";

import type {
  MetaItem,
  MetaLink
} from "@/stremio-core-ts-wrapper/src/types/models/meta-item";
const getLinksByCategory = (
  links: MetaLink[] | undefined,
  category: string
) => {
  if (!links) return [];
  return links.filter(
    (l) => l.category.toLowerCase() === category.toLowerCase()
  );
};

export function MetaPreviewPanel() {
  const { activeItem: rawActiveItem, clearSelection } = useBoardInteraction();
  const activeItem = rawActiveItem as unknown as MetaItem | null;
  const router = useRouter();

  return (
    <AnimatePresence mode="wait">
      {activeItem && (
        <PanelContent
          activeItem={activeItem}
          clearSelection={clearSelection}
          router={router}
        />
      )}
    </AnimatePresence>
  );
}

function PanelContent({
  activeItem,
  clearSelection,
  router
}: {
  activeItem: MetaItem;
  clearSelection: () => void;
  router: any;
}) {
  const genres = activeItem.genres?.length
    ? activeItem.genres
    : getLinksByCategory(activeItem.links, "genres").map((l) => l.name);

  const richCast = activeItem.app_extras?.cast?.slice(0, 6);
  const simpleCast =
    activeItem.cast?.slice(0, 5) ||
    getLinksByCategory(activeItem.links, "cast")
      .slice(0, 5)
      .map((l) => l.name);

  const directors = activeItem.director?.length
    ? activeItem.director
    : getLinksByCategory(activeItem.links, "directors").map((l) => l.name);

  const heroImage = activeItem.background || activeItem.poster;
  const hasLogo = !!activeItem.logo;

  return (
    <motion.div
      key={activeItem.id}
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={BOARD_UI.TRANSITION}
      className="fixed top-0 right-0 bottom-0 z-50 h-full overflow-hidden border-l border-white/10 bg-black/30 backdrop-blur-3xl"
      style={{ width: BOARD_UI.PANEL_WIDTH }}
    >
      {/* Noise Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Inner Highlight Line */}
      <div className="absolute top-0 bottom-0 left-0 w-px bg-linear-to-b from-transparent via-white/30 to-transparent opacity-50" />

      <div className="custom-scrollbar relative h-full overflow-y-auto">
        <button
          onClick={clearSelection}
          className="absolute top-6 right-6 z-50 rounded-full border border-white/10 bg-black/20 p-2.5 text-white/70 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero Section */}
        <div className="group relative h-[350px] w-full shrink-0">
          <SmartImage
            src={heroImage}
            alt={activeItem.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-[#0a0a0a]/40" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

          <div className="absolute right-0 bottom-0 left-0 flex flex-col items-start justify-end p-8 pb-0">
            {hasLogo ? (
              <img
                src={activeItem.logo}
                alt={activeItem.name}
                className="mb-4 max-h-24 max-w-[80%] object-contain drop-shadow-2xl"
              />
            ) : (
              <h1 className="mb-2 line-clamp-2 text-3xl leading-tight font-bold text-white drop-shadow-lg">
                {activeItem.name}
              </h1>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-bold tracking-wide text-zinc-300 uppercase">
              {activeItem.releaseInfo && (
                <span className="rounded-md border border-white/5 bg-white/10 px-2 py-1 backdrop-blur-md">
                  {activeItem.releaseInfo.split("-")[0]}
                </span>
              )}
              {activeItem.runtime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-zinc-400" />
                  <span>{activeItem.runtime}</span>
                </div>
              )}
              {activeItem.imdbRating && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-3 w-3 fill-current" />
                  <span>{activeItem.imdbRating}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Body */}
        <div className="space-y-8 p-8 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <LiquidGlassButton
              onClick={() =>
                router.push(`/detail/${activeItem.type}/${activeItem.id}`)
              }
              className="h-12 text-sm"
            >
              <Play className="mr-2 h-4 w-4 fill-current" />
              Watch
            </LiquidGlassButton>
            <LiquidGlassButton
              variant="secondary"
              onClick={() =>
                router.push(`/detail/${activeItem.type}/${activeItem.id}`)
              }
              className="h-12 text-sm"
            >
              <Info className="mr-2 h-4 w-4" />
              Details
            </LiquidGlassButton>
          </div>

          <div>
            <div className="prose prose-invert prose-sm">
              <p className="line-clamp-6 text-sm leading-relaxed font-light text-zinc-300 mix-blend-plus-lighter">
                {activeItem.description || "No synopsis available."}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-400">
              {directors && directors.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-bold tracking-wider text-zinc-500 uppercase">
                    Director
                  </span>
                  <span>{directors[0]}</span>
                </div>
              )}
              {activeItem.country && (
                <div className="flex items-center gap-2">
                  <Globe className="h-3 w-3" />
                  <span>{activeItem.country}</span>
                </div>
              )}
            </div>
          </div>

          {/* Genres */}
          {genres && genres.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold tracking-widest text-blue-200/50 uppercase">
                Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {genres.map((g) => (
                  <span
                    key={g}
                    className="cursor-default rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-white/20 hover:text-white"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cast */}
          {(richCast || (simpleCast && simpleCast.length > 0)) && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold tracking-widest text-blue-200/50 uppercase">
                Starring
              </h3>
              {richCast ? (
                <div className="grid grid-cols-3 gap-3">
                  {richCast.map((actor, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2 text-center"
                    >
                      <div className="h-14 w-14 overflow-hidden rounded-full border border-white/10 bg-zinc-900/50 shadow-inner">
                        {actor.photo ? (
                          <SmartImage
                            src={actor.photo}
                            alt={actor.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-full w-full p-3 text-zinc-700" />
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p className="line-clamp-1 text-[10px] font-bold text-zinc-300">
                          {actor.name}
                        </p>
                        {actor.character && (
                          <p className="line-clamp-1 text-[9px] text-zinc-500">
                            {actor.character}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {simpleCast?.map((actor, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <User className="h-3 w-3 text-zinc-500" />
                      <span className="text-xs text-zinc-300">{actor}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeItem.awards && (
            <div className="flex items-start gap-3 rounded-xl border border-yellow-500/20 bg-linear-to-r from-yellow-900/20 to-transparent p-4">
              <Award className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500/80" />
              <div>
                <h4 className="mb-1 text-xs font-bold text-yellow-500/90 uppercase">
                  Awards
                </h4>
                <p className="text-xs text-zinc-300 italic">
                  {activeItem.awards}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
