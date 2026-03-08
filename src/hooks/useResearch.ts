"use client";

import { useState, useCallback } from "react";
import type {
  Report,
  SectionKey,
  SectionStatus,
  CompanyOverview,
  MarketLandscape,
  PeopleOrg,
  PublicPerception,
  FinancialOutlook,
  StrategicFit,
} from "@/lib/types";

type SectionData =
  | CompanyOverview
  | MarketLandscape
  | PeopleOrg
  | PublicPerception
  | FinancialOutlook
  | StrategicFit;

interface SectionStates {
  overview: { status: SectionStatus; data: CompanyOverview | null; error?: string };
  market: { status: SectionStatus; data: MarketLandscape | null; error?: string };
  people: { status: SectionStatus; data: PeopleOrg | null; error?: string };
  perception: { status: SectionStatus; data: PublicPerception | null; error?: string };
  financial: { status: SectionStatus; data: FinancialOutlook | null; error?: string };
  fit: { status: SectionStatus; data: StrategicFit | null; error?: string };
}

const initialSectionStates: SectionStates = {
  overview: { status: "idle", data: null },
  market: { status: "idle", data: null },
  people: { status: "idle", data: null },
  perception: { status: "idle", data: null },
  financial: { status: "idle", data: null },
  fit: { status: "idle", data: null },
};

export function useResearch() {
  const [sections, setSections] = useState<SectionStates>(initialSectionStates);
  const [report, setReport] = useState<Report | null>(null);
  const [isResearching, setIsResearching] = useState(false);

  const updateSection = useCallback(
    (key: SectionKey, update: Partial<SectionStates[SectionKey]>) => {
      setSections((prev) => ({
        ...prev,
        [key]: { ...prev[key], ...update },
      }));
    },
    []
  );

  const fetchSection = useCallback(
    async (
      key: SectionKey,
      companyName: string,
      reportId: string,
      role?: string,
      context?: Record<string, unknown>
    ) => {
      updateSection(key, { status: "loading", error: undefined });

      try {
        const body: Record<string, unknown> = { companyName, reportId };
        if (role) body.role = role;
        if (context) body.context = context;

        const res = await fetch(`/api/sections/${key}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          throw new Error(`Section ${key} failed: ${res.statusText}`);
        }

        const data = (await res.json()) as SectionData;
        updateSection(key, { status: "complete", data: data as never });
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Research failed";
        updateSection(key, { status: "error", error: message });
        return null;
      }
    },
    [updateSection]
  );

  const startResearch = useCallback(
    async (companyName: string, role?: string) => {
      setIsResearching(true);
      setSections(initialSectionStates);

      // Create the report first
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, role }),
      });

      if (!res.ok) {
        setIsResearching(false);
        return null;
      }

      const newReport = (await res.json()) as Report;
      setReport(newReport);

      // Fire first 5 sections in parallel (fit waits for context)
      const primarySections: SectionKey[] = [
        "overview",
        "market",
        "people",
        "perception",
        "financial",
      ];

      const results = await Promise.allSettled(
        primarySections.map((key) =>
          fetchSection(key, companyName, newReport.id, role)
        )
      );

      // Collect context from completed sections for the fit section
      const context: Record<string, unknown> = {};
      const sectionKeys = primarySections;
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status === "fulfilled" && result.value) {
          context[sectionKeys[i]] = result.value;
        }
      }

      // Now run the fit section with context
      await fetchSection("fit", companyName, newReport.id, role, context);

      setIsResearching(false);
      return newReport;
    },
    [fetchSection]
  );

  const refreshSection = useCallback(
    async (key: SectionKey, companyName: string, reportId: string, role?: string) => {
      // For fit, gather context from current state
      if (key === "fit") {
        const context: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(sections)) {
          if (k !== "fit" && v.data) {
            context[k] = v.data;
          }
        }
        return fetchSection(key, companyName, reportId, role, context);
      }
      return fetchSection(key, companyName, reportId, role);
    },
    [fetchSection, sections]
  );

  const loadReport = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/research/${id}`);
      if (!res.ok) return null;

      const loaded = (await res.json()) as Report;
      setReport(loaded);

      // Populate section states from saved data
      const newStates = { ...initialSectionStates };
      for (const key of Object.keys(newStates) as SectionKey[]) {
        const data = loaded.sections[key];
        if (data) {
          (newStates[key] as { status: SectionStatus; data: typeof data }) = {
            status: "complete",
            data,
          };
        }
      }
      setSections(newStates);

      return loaded;
    },
    []
  );

  return {
    report,
    sections,
    isResearching,
    startResearch,
    refreshSection,
    loadReport,
  };
}
