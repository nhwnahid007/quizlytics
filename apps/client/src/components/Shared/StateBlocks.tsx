"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  className?: string;
  indicatorClassName?: string;
  label?: string;
};

export function ProgressBar({
  value,
  className,
  indicatorClassName,
  label = "Progress",
}: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(safeValue)}
    >
      <div
        className={cn(
          "h-full rounded-full bg-primary-color transition-all duration-700 ease-out will-change-[width]",
          indicatorClassName
        )}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-muted", className)} />;
}

export function DashboardSkeleton() {
  return (
    <div className="mx-auto min-h-screen max-w-7xl p-4 md:p-8">
      <div className="mb-10 space-y-3">
        <SkeletonBlock className="h-9 w-56" />
        <SkeletonBlock className="h-5 w-80 max-w-full" />
      </div>
      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[0, 1, 2].map(item => (
          <div
            key={item}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <SkeletonBlock className="mb-4 h-11 w-11 rounded-xl" />
            <SkeletonBlock className="mb-2 h-4 w-28" />
            <SkeletonBlock className="h-8 w-20" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[0, 1, 2].map(item => (
          <div
            key={item}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <SkeletonBlock className="mb-5 h-12 w-12 rounded-xl" />
            <SkeletonBlock className="mb-3 h-6 w-36" />
            <SkeletonBlock className="mb-2 h-4 w-full" />
            <SkeletonBlock className="mb-6 h-4 w-5/6" />
            <SkeletonBlock className="h-11 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon = AlertCircle,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/60 px-4 py-10 text-center",
        className
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-card text-primary-color shadow-sm">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

type ErrorStateProps = {
  title: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel = "Try Again",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-md flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 px-5 py-8 text-center dark:border-red-900/60 dark:bg-red-950/30",
        className
      )}
      role="alert"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-card text-red-600 shadow-sm">
        <AlertCircle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {onRetry ? (
          <Button type="button" onClick={onRetry} className="min-h-11 px-5">
            {retryLabel}
          </Button>
        ) : null}
        {action}
      </div>
    </div>
  );
}

export function InlineLoading({
  label = "Loading...",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 text-sm text-muted-foreground",
        className
      )}
    >
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
