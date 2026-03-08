"use client";

import type { Report } from "@/lib/types";

interface ReportListProps {
  reports: Report[];
}

export function ReportList({ reports }: ReportListProps) {
  if (reports.length === 0) return null;

  const completedSections = (report: Report) => {
    return Object.values(report.sections).filter(Boolean).length;
  };

  return (
    <div className="w-full max-w-xl">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Previous Reports
      </h2>
      <div className="space-y-2">
        {reports.map((report) => (
          <a
            key={report.id}
            href={`/research/${report.id}`}
            className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-sm"
          >
            <div>
              <h3 className="text-sm font-semibold text-navy">
                {report.companyName}
              </h3>
              {report.role && (
                <p className="text-xs text-slate-400">{report.role}</p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                {new Date(report.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                {completedSections(report)}/6 sections
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-300"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
