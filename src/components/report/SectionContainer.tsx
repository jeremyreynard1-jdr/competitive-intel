"use client";

import type { SectionStatus } from "@/lib/types";
import { SectionSkeleton } from "@/components/ui/Skeleton";

interface SectionContainerProps {
  title: string;
  subtitle: string;
  status: SectionStatus;
  error?: string;
  onRefresh?: () => void;
  children: React.ReactNode;
}

export function SectionContainer({
  title,
  subtitle,
  status,
  error,
  onRefresh,
  children,
}: SectionContainerProps) {
  return (
    <section className="border-b border-slate-200 pb-12 last:border-b-0">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-navy">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
        {onRefresh && status !== "loading" && (
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            Refresh
          </button>
        )}
      </div>

      {status === "loading" && <SectionSkeleton />}

      {status === "error" && (
        <div className="rounded-lg border border-red/20 bg-red-light/50 p-6 text-center">
          <p className="text-sm font-medium text-red">
            {error || "Something went wrong"}
          </p>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="mt-3 rounded-md bg-navy px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-navy-light"
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {status === "idle" && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
          <p className="text-sm text-slate-400">
            Start research to populate this section
          </p>
        </div>
      )}

      {status === "complete" && (
        <div className="section-enter section-enter-active">{children}</div>
      )}
    </section>
  );
}
