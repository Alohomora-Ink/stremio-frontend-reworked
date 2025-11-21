"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageTitle({ title, subtitle, className }: PageTitleProps) {
  const { typography } = useTheme();

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <h1 className={typography.pageTitle}>{title}</h1>
      {subtitle && (
        <p className="text-sm font-medium text-zinc-400 opacity-80">
          {subtitle}
        </p>
      )}
    </div>
  );
}
