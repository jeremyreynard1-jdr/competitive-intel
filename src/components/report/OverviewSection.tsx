"use client";

import type { CompanyOverview } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { FundingTimeline } from "./FundingTimeline";

interface OverviewSectionProps {
  data: CompanyOverview;
}

export function OverviewSection({ data }: OverviewSectionProps) {
  return (
    <div className="space-y-8">
      {/* Company Snapshot */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm text-slate-700 leading-relaxed">
          {data.description}
        </p>
        {data.mission && (
          <p className="mt-3 border-l-2 border-emerald pl-3 text-sm italic text-slate-600">
            {data.mission}
          </p>
        )}
      </div>

      {/* Key Facts */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Founded
          </p>
          <p className="mt-1 text-lg font-semibold text-navy">{data.founded}</p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Headquarters
          </p>
          <p className="mt-1 text-lg font-semibold text-navy">
            {data.headquarters}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Employees
          </p>
          <p className="mt-1 text-lg font-semibold text-navy">
            {data.employeeCount}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Website
          </p>
          <a
            href={data.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block truncate text-sm font-medium text-emerald hover:underline"
          >
            {data.website}
          </a>
        </div>
      </div>

      {/* Tech Stack */}
      {data.techStack.length > 0 && (
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Technology Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.techStack.map((tech, i) => (
              <Badge key={i} variant="accent">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Funding History */}
      {data.fundingHistory.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Funding History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="pb-2 pr-4 text-xs font-semibold text-slate-400">Date</th>
                  <th className="pb-2 pr-4 text-xs font-semibold text-slate-400">Round</th>
                  <th className="pb-2 pr-4 text-xs font-semibold text-slate-400">Amount</th>
                  <th className="pb-2 pr-4 text-xs font-semibold text-slate-400">Investors</th>
                  <th className="pb-2 text-xs font-semibold text-slate-400">Valuation</th>
                </tr>
              </thead>
              <tbody>
                {data.fundingHistory.map((round, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-2 pr-4 text-slate-500">{round.date}</td>
                    <td className="py-2 pr-4 font-medium text-navy">{round.round}</td>
                    <td className="py-2 pr-4 font-semibold text-navy">{round.amount}</td>
                    <td className="py-2 pr-4 text-slate-600">{round.investors.join(", ")}</td>
                    <td className="py-2 text-slate-500">{round.valuation || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Timeline */}
      {data.timeline.length > 0 && (
        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Company Timeline
          </h3>
          <FundingTimeline events={data.timeline} />
        </div>
      )}

      {/* Recent News */}
      {data.recentNews.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Recent News
          </h3>
          <div className="space-y-2">
            {data.recentNews.map((news, i) => (
              <a
                key={i}
                href={news.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{news.source}</span>
                  <span>{news.date}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-navy">
                  {news.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">{news.summary}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
