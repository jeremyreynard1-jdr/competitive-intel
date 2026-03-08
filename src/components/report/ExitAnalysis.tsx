"use client";

import type { FinancialOutlook } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

interface ExitAnalysisProps {
  data: FinancialOutlook;
}

export function ExitAnalysisDisplay({ data }: ExitAnalysisProps) {
  const exitPathColors: Record<string, string> = {
    IPO: "bg-blue-500 text-white",
    Acquisition: "bg-violet-500 text-white",
    "Stay Private": "bg-slate-500 text-white",
  };

  return (
    <div className="space-y-8">
      {/* Key Financials */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Revenue Estimate
          </p>
          <p className="mt-1 text-lg font-semibold text-navy">
            {data.revenueEstimate}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Growth
          </p>
          <p className="mt-1 text-lg font-semibold text-navy">
            {data.growthTrajectory}
          </p>
        </div>
        {data.burnRate && (
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Burn Rate
            </p>
            <p className="mt-1 text-lg font-semibold text-navy">
              {data.burnRate}
            </p>
          </div>
        )}
        {data.runway && (
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Runway
            </p>
            <p className="mt-1 text-lg font-semibold text-navy">
              {data.runway}
            </p>
          </div>
        )}
      </div>

      {/* Profitability */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Profitability Assessment
        </p>
        <p className="mt-2 text-sm text-slate-700">{data.profitability}</p>
      </div>

      {/* Exit Strategy */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Exit Strategy Analysis
        </h3>
        <div className="rounded-lg border border-slate-200 p-5">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Most Likely Path:</span>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${exitPathColors[data.exitStrategy.mostLikelyPath] || "bg-slate-200 text-slate-700"}`}
            >
              {data.exitStrategy.mostLikelyPath}
            </span>
            {data.exitStrategy.timeline && (
              <span className="text-xs text-slate-400">
                Timeline: {data.exitStrategy.timeline}
              </span>
            )}
          </div>
          <p className="mt-3 text-sm text-slate-700">
            {data.exitStrategy.reasoning}
          </p>

          {data.exitStrategy.potentialAcquirers.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Potential Acquirers
              </p>
              <div className="mt-2 space-y-2">
                {data.exitStrategy.potentialAcquirers.map((acq, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between rounded-lg bg-slate-50 p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-navy">
                        {acq.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600">
                        {acq.reasoning}
                      </p>
                    </div>
                    {acq.estimatedValue && (
                      <Badge variant="accent">{acq.estimatedValue}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparable Exits */}
      {data.comparableExits.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Comparable Exits
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="pb-2 pr-4 text-xs font-semibold text-slate-400">
                    Company
                  </th>
                  <th className="pb-2 pr-4 text-xs font-semibold text-slate-400">
                    Exit Type
                  </th>
                  <th className="pb-2 pr-4 text-xs font-semibold text-slate-400">
                    Value
                  </th>
                  <th className="pb-2 pr-4 text-xs font-semibold text-slate-400">
                    Date
                  </th>
                  <th className="pb-2 text-xs font-semibold text-slate-400">
                    Relevance
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.comparableExits.map((exit, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-2 pr-4 font-medium text-navy">
                      {exit.company}
                    </td>
                    <td className="py-2 pr-4 text-slate-600">
                      {exit.exitType}
                      {exit.acquirer && ` (${exit.acquirer})`}
                    </td>
                    <td className="py-2 pr-4 font-medium text-navy">
                      {exit.value}
                    </td>
                    <td className="py-2 pr-4 text-slate-500">{exit.date}</td>
                    <td className="py-2 text-slate-500">{exit.relevance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
