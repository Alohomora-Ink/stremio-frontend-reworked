"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SmartImage } from "@/components/ui/image";
import { CastList } from "@/features/details/components/info/CastList";
import { MetaHero } from "@/features/details/components/info/MetaHero";
import { MetaInfo } from "@/features/details/components/info/MetaInfo";
import { useAggregatedMeta } from "@/stremio-core-ts-wrapper/src/hooks/use-aggregated-meta";
import { MediaRightPanel } from "@/features/details/components/panel/MediaRightPanel";

export default function DetailPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string;
  const id = params.id as string;
  const { meta, isLoading } = useAggregatedMeta(type, id);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#050505]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-brand-primary h-10 w-10 animate-spin" />
          <p className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!meta) return null;
  const isSeries = type === "series" || type === "anime";

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#050505]">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <SmartImage
            src={meta.background || meta.poster}
            alt="Background Base"
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="absolute inset-0 z-20 bg-linear-to-r from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute inset-0 z-20 bg-linear-to-t from-[#050505] via-transparent to-transparent" />
      </div>

      <button
        onClick={() => router.back()}
        className="group fixed top-8 left-8 z-50 flex items-center justify-center rounded-full border border-white/10 bg-black/20 p-3 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/10 active:scale-95"
      >
        <ArrowLeft className="h-6 w-6 text-zinc-300 group-hover:text-white" />
      </button>

      <div className="relative z-30 flex h-full w-full">
        <div className="custom-scrollbar h-full flex-1 overflow-x-hidden overflow-y-auto">
          <div className="flex min-h-full w-full flex-col justify-center p-12 pl-24 lg:p-16 lg:pl-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mt-20 flex flex-col pb-20"
            >
              <div className="flex max-w-5xl flex-col gap-10">
                <MetaHero meta={meta} />
                {meta.description && (
                  <div className="max-w-3xl space-y-2">
                    <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
                      Synopsis
                    </h3>
                    <p className="text-lg leading-relaxed font-light text-zinc-200 shadow-black drop-shadow-md">
                      {meta.description}
                    </p>
                  </div>
                )}
                <div className="max-w-3xl">
                  <MetaInfo meta={meta} />
                </div>
              </div>

              {(meta.app_extras?.cast ||
                (meta.cast && meta.cast.length > 0)) && (
                <div className="mt-12 w-full min-w-0">
                  <CastList meta={meta} />
                </div>
              )}
            </motion.div>
          </div>
        </div>

        <MediaRightPanel meta={meta} />
      </div>
    </div>
  );
}
