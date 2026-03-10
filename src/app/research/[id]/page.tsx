"use client";

import { useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import { useResearch } from "@/hooks/useResearch";
import { ReportLayout } from "@/components/report/ReportLayout";
import type { SectionKey } from "@/lib/types";

export default function ResearchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const isNew = searchParams.get("new") === "true";
  const companyParam = searchParams.get("company");
  const roleParam = searchParams.get("role");

  const { report, sections, startResearch, refreshSection, loadReport } =
    useResearch();

  useEffect(() => {
    if (isNew && companyParam) {
      // Start research directly using URL params — no filesystem read needed
      startResearch(companyParam, roleParam || undefined);
    } else if (isNew) {
      // Fallback: try loading from API (works locally, may fail on Vercel)
      fetch(`/api/research/${id}`)
        .then((res) => res.json())
        .then((loaded) => {
          startResearch(loaded.companyName, loaded.role);
        })
        .catch(console.error);
    } else {
      loadReport(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew]);

  if (!report) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-navy" />
          <p className="mt-4 text-sm text-slate-500">Loading report...</p>
        </div>
      </div>
    );
  }

  const handleRefresh = (key: SectionKey) => {
    refreshSection(key, report.companyName, report.id, report.role);
  };

  return (
    <ReportLayout
      companyName={report.companyName}
      role={report.role}
      sections={sections}
      onRefresh={handleRefresh}
    />
  );
}
