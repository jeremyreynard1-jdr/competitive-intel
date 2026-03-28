"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NewResearchForm } from "@/components/dashboard/NewResearchForm";
import { CompanyPicker } from "@/components/dashboard/CompanyPicker";
import { ReportList } from "@/components/dashboard/ReportList";
import type { Report } from "@/lib/types";
import type { CompanyCandidate } from "@/app/api/disambiguate/route";

type PageState =
  | { step: "search" }
  | { step: "disambiguating" }
  | { step: "picking"; query: string; candidates: CompanyCandidate[]; role?: string }
  | { step: "creating" };

export default function DashboardPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [pageState, setPageState] = useState<PageState>({ step: "search" });

  useEffect(() => {
    fetch("/api/research")
      .then((res) => res.json())
      .then(setReports)
      .catch(console.error);
  }, []);

  const createReport = async (companyName: string, role?: string) => {
    setPageState({ step: "creating" });
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, role }),
      });

      if (!res.ok) throw new Error("Failed to create report");

      const report = (await res.json()) as Report;
      const params = new URLSearchParams({ new: "true", company: report.companyName });
      if (report.role) params.set("role", report.role);
      router.push(`/research/${report.id}?${params.toString()}`);
    } catch (error) {
      console.error("Failed to start research:", error);
      setPageState({ step: "search" });
    }
  };

  const handleSubmit = async (companyName: string, role?: string) => {
    setPageState({ step: "disambiguating" });

    try {
      const res = await fetch("/api/disambiguate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName }),
      });

      if (!res.ok) {
        // Fallback: skip disambiguation and proceed directly
        await createReport(companyName, role);
        return;
      }

      const data = (await res.json()) as {
        candidates: CompanyCandidate[];
        autoSelected?: boolean;
      };

      if (data.autoSelected && data.candidates.length === 1) {
        // Unambiguous — go straight to research
        const c = data.candidates[0];
        const disambiguatedName = `${c.name} (${c.industry})`;
        await createReport(disambiguatedName, role);
      } else if (data.candidates.length === 0) {
        // No matches — proceed with raw name
        await createReport(companyName, role);
      } else {
        // Multiple matches — show picker
        setPageState({
          step: "picking",
          query: companyName,
          candidates: data.candidates,
          role,
        });
      }
    } catch (error) {
      console.error("Disambiguation failed, proceeding directly:", error);
      await createReport(companyName, role);
    }
  };

  const handlePick = async (candidate: CompanyCandidate) => {
    const role = pageState.step === "picking" ? pageState.role : undefined;
    const disambiguatedName = `${candidate.name} (${candidate.industry})`;
    await createReport(disambiguatedName, role);
  };

  const handleBack = () => {
    setPageState({ step: "search" });
  };

  const isLoading = pageState.step === "disambiguating" || pageState.step === "creating";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="flex w-full max-w-xl flex-col items-center">
        {/* Logo / Title */}
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl font-bold text-navy">
            Competitive Intel
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            AI-powered company research for strategic conversations
          </p>
        </div>

        {/* Disambiguation picker */}
        {pageState.step === "picking" ? (
          <CompanyPicker
            query={pageState.query}
            candidates={pageState.candidates}
            onSelect={handlePick}
            onBack={handleBack}
          />
        ) : (
          <>
            {/* Search Form */}
            <NewResearchForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />

            {/* Loading state for disambiguation */}
            {pageState.step === "disambiguating" && (
              <p className="mt-3 text-xs text-slate-400 animate-pulse">
                Finding matching companies...
              </p>
            )}
          </>
        )}

        {/* Previous Reports */}
        <div className="mt-12 w-full">
          <ReportList
            reports={reports}
            onDelete={(id) => setReports((prev) => prev.filter((r) => r.id !== id))}
          />
        </div>
      </div>
    </div>
  );
}
