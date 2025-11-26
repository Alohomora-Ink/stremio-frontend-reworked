"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import {
  Bell,
  BellOff,
  Check,
  Clock,
  Film,
  Play,
  Plus,
  Star,
  AlertCircle,
  Loader2
} from "lucide-react";

import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/image";
import { useSelection } from "@/hooks/use-selection";
import { useAggregatedMeta } from "@/stremio-core-ts-wrapper/src/hooks/use-aggregated-meta";
import { useMetaUserState } from "@/features/details/hooks/use-meta-user-state";
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

export function MediaDrawer() {
  const { selection, clearSelection } = useSelection();
  const router = useRouter();

  // Guard against closing animation glitch if selection becomes null
  // We keep the logic simple: if selection exists, it's open.
  const isOpen = !!selection;

  return (
    <Drawer isOpen={isOpen} onClose={clearSelection} width={450}>
      <AnimatePresence mode="wait">
        {selection && (
          <DrawerContent
            key={`${selection.type}-${selection.id}`}
            type={selection.type}
            id={selection.id}
            router={router}
          />
        )}
      </AnimatePresence>
    </Drawer>
  );
}

function DrawerContent({
  type,
  id,
  router
}: {
  type: string;
  id: string;
  router: any;
}) {
  // 'isLoading' = true ONLY if we have NO data yet.
  // 'isUpdating' = true if we HAVE data but are fetching more sources.
  const { meta, isLoading, isUpdating } = useAggregatedMeta(type, id);

  // 1. Critical Loading (No data at all)
  if (isLoading && !meta) {
    return (
      <div className="flex h-full items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="text-brand-primary h-8 w-8 animate-spin" />
          <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
            Loading Info...
          </span>
        </div>
      </div>
    );
  }

  // 2. Error / Not Found State
  // If we are NOT loading anymore, but still have no meta, something failed.
  if (!meta) {
    return (
      <div className="flex h-full items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-2 text-zinc-500">
          <AlertCircle className="h-10 w-10 opacity-50" />
          <span className="text-xs font-medium">Failed to load details</span>
        </div>
      </div>
    );
  }

  // 3. Success State
  return <InnerPanel meta={meta} router={router} isUpdating={isUpdating} />;
}

function InnerPanel({
  meta,
  router,
  isUpdating
}: {
  meta: MetaItem;
  router: any;
  isUpdating: boolean;
}) {
  const {
    inLibrary,
    handleToggleLibrary,
    notificationsEnabled,
    toggleNotifications
  } = useMetaUserState(meta);

  useEffect(() => {
    router.prefetch(`/detail/${meta.type}/${meta.id}`);
  }, [router, meta.type, meta.id]);

  const richCast = meta.app_extras?.cast?.slice(0, 6);
  const heroImage = meta.background || meta.poster;

  return (
    <div className="relative h-full w-full bg-[#050505]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <SmartImage
          src={heroImage}
          alt="bg"
          className="h-full w-full object-cover opacity-100"
        />
        <div
          className="absolute inset-0 backdrop-blur-sm"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 100%)"
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/10 via-[#050505]/80 to-[#050505]" />
      </div>

      <div className="custom-scrollbar relative z-10 h-full overflow-x-hidden overflow-y-auto">
        <div className="relative flex min-h-[450px] flex-col justify-end p-8 pb-6">
          <div className="mb-6 flex min-h-[60px] items-end">
            {meta.logo ? (
              <img
                src={meta.logo}
                alt={meta.name}
                className="max-h-50 max-w-[85%] object-contain drop-shadow-2xl"
              />
            ) : (
              <h1 className="line-clamp-3 text-4xl leading-[1.1] font-black text-white drop-shadow-lg">
                {meta.name}
              </h1>
            )}
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold tracking-wide text-zinc-300 uppercase opacity-90">
            {meta.releaseInfo && (
              <span className="rounded-md bg-white/10 px-2 py-1 backdrop-blur-md">
                {meta.releaseInfo.substring(0, 4)}
              </span>
            )}
            {meta.runtime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-zinc-500" />
                <span>{meta.runtime}</span>
              </div>
            )}
            {meta.imdbRating && (
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-3 w-3 fill-current" />
                <span>{meta.imdbRating}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => router.push(`/detail/${meta.type}/${meta.id}`)}
              // Button spins ONLY if we are still discovering sources/videos
              isLoading={isUpdating}
              className="flex-1 shadow-lg shadow-blue-900/20"
            >
              {/* While updating, we hide the icon to show spinner, or keep icon if you prefer */}
              {!isUpdating && <Play className="mr-2 h-4 w-4 fill-current" />}
              <span>{isUpdating ? "Loading Sources..." : "Watch Now"}</span>
            </Button>

            <Button
              variant="icon"
              onClick={handleToggleLibrary}
              className={
                inLibrary
                  ? "border-green-500/50 bg-green-500/20 text-green-400"
                  : ""
              }
            >
              {inLibrary ? (
                <Check className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="icon"
              onClick={toggleNotifications}
              disabled={!inLibrary}
              className={
                notificationsEnabled
                  ? "border-purple-500/50 bg-purple-500/20 text-purple-400"
                  : ""
              }
            >
              {notificationsEnabled ? (
                <Bell className="h-5 w-5" />
              ) : (
                <BellOff className="h-5 w-5" />
              )}
            </Button>

            <Button variant="icon" disabled={!meta.trailers?.length}>
              <Film className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-8 px-8 pb-24">
          <p className="line-clamp-6 text-sm leading-relaxed font-light text-zinc-300 mix-blend-plus-lighter">
            {meta.description || "No synopsis available."}
          </p>

          {richCast && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                Starring
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {richCast.map((actor, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 text-center"
                  >
                    <div className="h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-zinc-800">
                      <SmartImage
                        src={actor.photo || undefined}
                        alt={actor.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="line-clamp-1 text-[10px] font-bold text-zinc-200">
                        {actor.name}
                      </span>
                      <span className="line-clamp-1 text-[9px] text-zinc-500">
                        {actor.character}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
