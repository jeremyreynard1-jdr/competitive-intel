"use client";

import type { PeopleOrg } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { LeadershipGrid } from "./LeadershipGrid";

interface PeopleSectionProps {
  data: PeopleOrg;
}

export function PeopleSection({ data }: PeopleSectionProps) {
  return (
    <div className="space-y-8">
      {/* Team Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Team Size
          </p>
          <p className="mt-1 text-lg font-semibold text-navy">
            {data.teamSize}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Open Roles
          </p>
          <p className="mt-1 text-lg font-semibold text-navy">
            {data.openRoles.length}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Key Departments
          </p>
          <p className="mt-1 text-sm text-navy">
            {data.departments.slice(0, 4).join(", ")}
          </p>
        </div>
      </div>

      {/* Leadership */}
      <LeadershipGrid
        leaders={data.leadership}
        boardMembers={data.boardMembers}
      />

      {/* Hiring Trends */}
      {data.hiringTrends && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Hiring Analysis
          </h3>
          <div className="rounded-lg border border-slate-200 p-5">
            <p className="text-sm text-slate-700 leading-relaxed">
              {data.hiringTrends.summary}
            </p>

            {data.hiringTrends.trendingDepartments.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">
                  Trending departments:
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {data.hiringTrends.trendingDepartments.map((dept, i) => (
                    <Badge key={i} variant="accent">
                      {dept}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {data.hiringTrends.signals.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">
                  What the hiring tells us:
                </p>
                <ul className="mt-1 space-y-1">
                  {data.hiringTrends.signals.map((signal, i) => (
                    <li key={i} className="text-sm text-slate-600">
                      {signal}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Open Roles */}
      {data.openRoles.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Open Roles
          </h3>
          <div className="space-y-1">
            {data.openRoles.map((role, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-navy">
                    {role.title}
                  </span>
                  <Badge>{role.department}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    {role.location}
                  </span>
                  {role.url && (
                    <a
                      href={role.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald hover:underline"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Culture Signals */}
      {data.cultureSignals.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Culture Signals
          </h3>
          <div className="space-y-2">
            {data.cultureSignals.map((signal, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-slate-100 p-3"
              >
                <Badge variant={signal.sentiment}>{signal.sentiment}</Badge>
                <div>
                  <p className="text-sm text-slate-700">{signal.signal}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Source: {signal.source}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
