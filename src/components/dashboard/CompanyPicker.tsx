"use client";

import type { CompanyCandidate } from "@/app/api/disambiguate/route";

interface CompanyPickerProps {
  query: string;
  candidates: CompanyCandidate[];
  onSelect: (candidate: CompanyCandidate) => void;
  onBack: () => void;
}

export function CompanyPicker({
  query,
  candidates,
  onSelect,
  onBack,
}: CompanyPickerProps) {
  return (
    <div className="w-full max-w-xl">
      <p className="mb-1 text-sm text-slate-500">
        Multiple companies match &ldquo;{query}&rdquo;
      </p>
      <h2 className="mb-4 text-lg font-semibold text-navy">
        Which company did you mean?
      </h2>

      <div className="space-y-2">
        {candidates.map((c, i) => (
          <button
            key={i}
            onClick={() => onSelect(c)}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-left transition-all hover:border-emerald hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="text-sm font-semibold text-navy">
                  {c.name}
                </span>
                <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  {c.industry}
                </span>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {c.description}
                </p>
              </div>
              {c.location && (
                <span className="flex-shrink-0 text-xs text-slate-400 whitespace-nowrap">
                  {c.location}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onBack}
        className="mt-4 text-xs text-slate-400 hover:text-slate-600 transition-colors"
      >
        &larr; None of these &mdash; search again
      </button>
    </div>
  );
}
