"use client";

import { cn } from "@/lib/utils";

interface TitleProps {
  children: React.ReactNode;
  className?: string;
  subtitle?: string;
}

export function PageTitle({ children, className, subtitle }: TitleProps) {
  return (
    <div className={cn("mb-6 flex flex-col gap-1", className)}>
      <h1 className="text-page-title">{children}</h1>
      {subtitle && (
        <p className="text-sm font-medium text-zinc-400 opacity-80">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function SectionTitle({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h2 className={cn("text-section-title", className)}>{children}</h2>;
}
