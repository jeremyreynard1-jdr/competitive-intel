"use client";

import type { Competitor } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

interface CompetitorGridProps {
  competitors: Competitor[];
}

export function CompetitorGrid({ competitors }: CompetitorGridProps) {
  if (!competitors.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {competitors.map((comp, i) => (
        <div
          key={i}
          className="rounded-lg border border-slate-200 p-5 transition-shadow hover:shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-navy">{comp.name}</h4>
              {comp.estimatedSize && (
                <span className="text-xs text-slate-400">
                  {comp.estimatedSize}
                </span>
              )}
            </div>
            {comp.website && (
              <a
                href={comp.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald hover:underline"
              >
                Visit
              </a>
            )}
          </div>

          <p className="mt-2 text-sm text-slate-600">{comp.description}</p>

          {comp.differentiators.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {comp.differentiators.map((d, j) => (
                <Badge key={j} variant="accent">
                  {d}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-3">
            {comp.strengths.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-dark">
                  Strengths
                </p>
                <ul className="mt-1 space-y-0.5">
                  {comp.strengths.map((s, j) => (
                    <li key={j} className="text-xs text-slate-600">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {comp.weaknesses.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-red">
                  Weaknesses
                </p>
                <ul className="mt-1 space-y-0.5">
                  {comp.weaknesses.map((w, j) => (
                    <li key={j} className="text-xs text-slate-600">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
