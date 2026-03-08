"use client";

import { useState } from "react";
import type { Report } from "@/lib/types";

interface ReportListProps {
  reports: Report[];
  onDelete?: (id: string) => void;
}

export function ReportList({ reports, onDelete }: ReportListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (reports.length === 0) return null;

  const completedSections = (report: Report) => {
    return Object.values(report.sections).filter(Boolean).length;
  };

  const handleDelete = async (e: React.MouseEvent, reportId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingId(reportId);

    try {
      const res = await fetch(`/api/research/${reportId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        onDelete?.(reportId);
      }
    } catch {
      // silently fail
    } finally {
      setDeletingId(null);
    }
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
            className="group flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-sm"
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
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                {completedSections(report)}/6 sections
              </span>
              <button
                onClick={(e) => handleDelete(e, report.id)}
                disabled={deletingId === report.id}
                className="rounded p-1 text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-400 group-hover:opacity-100"
                title="Delete report"
              >
                {deletingId === report.id ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
                  </svg>
                )}
              </button>
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
