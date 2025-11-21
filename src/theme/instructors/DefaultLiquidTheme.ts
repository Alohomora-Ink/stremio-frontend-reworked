import type { UITheme } from "../types";

export const DefaultLiquidTheme: UITheme = {
    name: "Liquid Glass (Default)",

    surface: "bg-white/5 backdrop-blur-xl border border-white/10 ring-1 ring-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]",

    card: {
        container: "relative group/card flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl p-1.5 transition-all duration-500 ease-out shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:-translate-y-4 hover:scale-105 bg-white/5 backdrop-blur-xl border border-white/10 ring-1 ring-white/20",
        inner: "relative h-full w-full overflow-hidden rounded-xl bg-zinc-900 shadow-inner",
        image: "h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110",
        overlay: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100",
        textWrapper: "absolute inset-0 flex flex-col justify-end p-3",
        title: "text-sm font-bold text-white drop-shadow-md line-clamp-2 leading-tight translate-y-2 transition-transform duration-300 group-hover/card:translate-y-0",
        subtitle: "text-[10px] font-medium text-blue-200 mt-1 translate-y-2 transition-transform duration-300 delay-75 group-hover/card:translate-y-0",
        hoverEffect: "hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    },

    rail: {
        container: "relative group/rail -ml-24 md:-ml-32 -mr-8 md:-mr-16 mb-12",
        track: "flex gap-6 overflow-x-auto pb-12 pt-12 pl-24 md:pl-32 pr-8 md:pr-16 scrollbar-hide scroll-smooth",
        button: {
            base: "group/btn relative flex items-center justify-center rounded-full p-5 backdrop-blur-2xl bg-linear-to-br from-white/60 via-blue-200/40 to-blue-400/20 border border-white/30 hover:border-white/50 shadow-[inset_0_1px_12px_rgba(255,255,255,0.4),0_8px_32px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all duration-500",
            icon: "h-6 w-6 text-white drop-shadow-lg",
            positionLeft: "absolute left-24 md:left-32 top-1/2 -translate-y-1/2 z-30",
            positionRight: "absolute right-8 md:right-16 top-1/2 -translate-y-1/2 z-30"
        }
    },

    typography: {
        pageTitle: "text-4xl font-bold text-white mb-2 drop-shadow-lg",
        sectionTitle: "text-xl font-bold text-white/90 drop-shadow-md pl-1",
        sectionSubtitle: "text-xs font-bold text-blue-300/80 mb-1 uppercase tracking-wider pl-1"
    },

    skeleton: {
        container: "animate-pulse flex gap-6 overflow-hidden pb-12 pt-12 pl-24 md:pl-32 pr-8 md:pr-16",
        card: "relative aspect-2/3 w-[140px] md:w-[160px] shrink-0 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm",
        text: "h-4 w-3/4 rounded-md bg-white/10 mt-4",
        errorCard: "relative aspect-2/3 w-[140px] md:w-[160px] shrink-0 rounded-2xl border border-red-500/30 bg-red-500/5 backdrop-blur-sm shadow-[inset_0_0_20px_rgba(220,38,38,0.1)]",
        errorText: "h-4 w-1/2 rounded-md bg-red-500/20 mt-4"
    }
};