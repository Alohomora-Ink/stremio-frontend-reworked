import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

interface GlassProps extends HTMLMotionProps<"div"> {
  intensity?: "low" | "medium" | "high";
  interactive?: boolean;
}

export function Glass({
  className,
  intensity = "medium",
  interactive = false,
  children,
  ...props
}: GlassProps) {
  const intensityMap = {
    low: "bg-zinc-900/40 backdrop-blur-md border-white/5",
    medium: "bg-zinc-900/60 backdrop-blur-xl border-white/10",
    high: "bg-zinc-800/80 backdrop-blur-2xl border-white/15",
  };

  return (
    <motion.div
      className={cn(
        "border rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden",
        intensityMap[intensity],
        interactive &&
          "cursor-pointer hover:bg-white/10 hover:border-white/20 transition-colors duration-300",
        className,
      )}
      {...props}
    >
      {/* TODO: Subtle Noise Texture or Shine could go here */}
      {children}
    </motion.div>
  );
}
