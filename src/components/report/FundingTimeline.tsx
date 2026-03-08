"use client";

import type { TimelineEvent } from "@/lib/types";

const typeColors: Record<TimelineEvent["type"], string> = {
  founding: "bg-emerald text-white",
  funding: "bg-blue-500 text-white",
  product: "bg-violet-500 text-white",
  milestone: "bg-amber text-white",
  acquisition: "bg-red text-white",
  other: "bg-slate-400 text-white",
};

const typeLabels: Record<TimelineEvent["type"], string> = {
  founding: "Founded",
  funding: "Funding",
  product: "Product",
  milestone: "Milestone",
  acquisition: "Acquisition",
  other: "Event",
};

interface FundingTimelineProps {
  events: TimelineEvent[];
}

export function FundingTimeline({ events }: FundingTimelineProps) {
  if (!events.length) return null;

  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-200" />

      <div className="space-y-6">
        {sorted.map((event, i) => (
          <div key={i} className="relative flex gap-4">
            {/* Node */}
            <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold ${typeColors[event.type]}`}
              >
                {typeLabels[event.type].charAt(0)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-medium text-slate-400">
                  {event.date}
                </span>
                <span
                  className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium ${typeColors[event.type]}`}
                >
                  {typeLabels[event.type]}
                </span>
              </div>
              <h4 className="mt-1 text-sm font-semibold text-navy">
                {event.title}
              </h4>
              <p className="mt-0.5 text-sm text-slate-600">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
