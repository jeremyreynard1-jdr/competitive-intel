"use client";

import type { MarketLandscape } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { CompetitorGrid } from "./CompetitorGrid";

interface MarketSectionProps {
  data: MarketLandscape;
}

export function MarketSection({ data }: MarketSectionProps) {
  return (
    <div className="space-y-8">
      {/* Market Size & Growth */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Market Size (TAM)
          </p>
          <p className="mt-1 text-lg font-semibold text-navy">
            {data.marketSize}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Growth Rate
          </p>
          <p className="mt-1 text-lg font-semibold text-navy">
            {data.marketGrowthRate}
          </p>
        </div>
      </div>

      {/* Positioning */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Market Positioning
        </p>
        <p className="mt-2 text-sm text-slate-700 leading-relaxed">
          {data.positioning}
        </p>
      </div>

      {/* Messaging Analysis */}
      {data.messagingAnalysis && (
        <div className="rounded-lg border border-slate-200 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Messaging Analysis
          </p>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            {data.messagingAnalysis}
          </p>
        </div>
      )}

      {/* Competitors */}
      {data.competitors.length > 0 && (
        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Competitive Landscape
          </h3>
          <CompetitorGrid competitors={data.competitors} />
        </div>
      )}

      {/* Advantages & Risks */}
      <div className="grid gap-4 sm:grid-cols-2">
        {data.competitiveAdvantages.length > 0 && (
          <div className="rounded-lg border border-emerald/20 bg-emerald-light/30 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-dark">
              Competitive Advantages
            </p>
            <ul className="mt-3 space-y-2">
              {data.competitiveAdvantages.map((adv, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <span className="mt-1 flex-shrink-0 text-emerald">+</span>
                  {adv}
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.competitiveRisks.length > 0 && (
          <div className="rounded-lg border border-red/20 bg-red-light/30 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-red">
              Competitive Risks
            </p>
            <ul className="mt-3 space-y-2">
              {data.competitiveRisks.map((risk, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <span className="mt-1 flex-shrink-0 text-red">!</span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Industry Trends */}
      {data.industryTrends.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Industry Trends
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.industryTrends.map((trend, i) => (
              <Badge key={i} variant="default">
                {trend}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
