"use client";

import type { StrategicFit } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

interface FitSectionProps {
  data: StrategicFit;
}

export function FitSection({ data }: FitSectionProps) {
  return (
    <div className="space-y-8">
      {/* Org Gaps */}
      {data.orgGaps.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Organizational Gaps
          </h3>
          <div className="space-y-3">
            {data.orgGaps.map((gap, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 p-5"
              >
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-navy">
                    {gap.area}
                  </h4>
                  <Badge variant={gap.hasCurrentLeader ? "positive" : "negative"}>
                    {gap.hasCurrentLeader ? "Filled" : "Gap"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-slate-600">{gap.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  <span className="font-medium">Impact:</span> {gap.impact}
                </p>
                {gap.currentLeader && (
                  <p className="mt-1 text-xs text-slate-400">
                    Current: {gap.currentLeader}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategic Challenges */}
      {data.strategicChallenges.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Strategic Challenges You Could Address
          </h3>
          <div className="rounded-lg border border-amber/20 bg-amber-light/30 p-5">
            <ul className="space-y-2">
              {data.strategicChallenges.map((challenge, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <span className="mt-0.5 flex-shrink-0 text-amber">&#9670;</span>
                  {challenge}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Skill Alignment */}
      {data.skillAlignment.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Skills Alignment
          </h3>
          <div className="space-y-3">
            {data.skillAlignment.map((match, i) => (
              <div
                key={i}
                className="rounded-lg border border-emerald/20 bg-emerald-light/20 p-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-red">
                      Their Challenge
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {match.challenge}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-dark">
                      Your Skill
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {match.relevantSkill}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  <span className="font-medium">Evidence:</span>{" "}
                  {match.evidence}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Value Propositions */}
      {data.valuePropositions.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Your Value Proposition
          </h3>
          <div className="rounded-lg border border-emerald/20 bg-emerald-light/10 p-5">
            <ul className="space-y-2">
              {data.valuePropositions.map((vp, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-700">
                  <span className="mt-0.5 flex-shrink-0 text-emerald">&#10003;</span>
                  {vp}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Recommendation */}
      {data.recommendation && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Strategic Recommendation
          </h3>
          <div className="rounded-lg border-2 border-navy bg-navy/5 p-6">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {data.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
