"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/ThemeProvider";

interface SectionTitleProps {
  title: string;
  className?: string;
}

export function SectionTitle({ title, className }: SectionTitleProps) {
  const { typography } = useTheme();

  return <h2 className={cn(typography.sectionTitle, className)}>{title}</h2>;
}
