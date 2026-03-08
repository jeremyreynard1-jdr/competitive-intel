"use client";

import { useState } from "react";
import type {
  SectionKey,
  SectionStatus,
  CompanyOverview,
  MarketLandscape,
  PeopleOrg,
  PublicPerception,
  FinancialOutlook,
  StrategicFit,
} from "@/lib/types";
import { SectionContainer } from "./SectionContainer";
import { OverviewSection } from "./OverviewSection";
import { MarketSection } from "./MarketSection";
import { PeopleSection } from "./PeopleSection";
import { PerceptionSection } from "./PerceptionSection";
import { FinancialSection } from "./FinancialSection";
import { FitSection } from "./FitSection";

interface SectionConfig {
  key: SectionKey;
  title: string;
  subtitle: string;
  icon: string;
}

const SECTIONS: SectionConfig[] = [
  {
    key: "overview",
    title: "Company Overview",
    subtitle: "What they are, where they've been, where they stand today",
    icon: "1",
  },
  {
    key: "market",
    title: "Market & Competitive Landscape",
    subtitle: "How they compete and what they need to get right",
    icon: "2",
  },
  {
    key: "people",
    title: "People & Organization",
    subtitle: "Who's running it and how it's structured",
    icon: "3",
  },
  {
    key: "perception",
    title: "Public Perception",
    subtitle: "What the outside world thinks",
    icon: "4",
  },
  {
    key: "financial",
    title: "Financial Outlook & Exit",
    subtitle: "Where they're headed financially",
    icon: "5",
  },
  {
    key: "fit",
    title: "How I Can Help",
    subtitle: "Strategic fit — where you plug in",
    icon: "6",
  },
];

type SectionDataMap = {
  overview: CompanyOverview;
  market: MarketLandscape;
  people: PeopleOrg;
  perception: PublicPerception;
  financial: FinancialOutlook;
  fit: StrategicFit;
};

interface ReportLayoutProps {
  companyName: string;
  role?: string;
  sections: {
    [K in SectionKey]: {
      status: SectionStatus;
      data: SectionDataMap[K] | null;
      error?: string;
    };
  };
  onRefresh: (key: SectionKey) => void;
}

const statusColors: Record<SectionStatus, string> = {
  idle: "bg-slate-200",
  loading: "bg-amber animate-pulse",
  complete: "bg-emerald",
  error: "bg-red",
};

export function ReportLayout({
  companyName,
  role,
  sections,
  onRefresh,
}: ReportLayoutProps) {
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <a href="/" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                &larr; All Reports
              </a>
              <h1 className="font-heading text-2xl font-bold text-navy">
                {companyName}
              </h1>
              {role && (
                <p className="text-sm text-slate-500">
                  Role: {role}
                </p>
              )}
            </div>
          </div>

          {/* Section Nav */}
          <nav className="mt-4 flex gap-1 overflow-x-auto pb-1">
            {SECTIONS.map((section) => (
              <button
                key={section.key}
                onClick={() => {
                  setActiveSection(section.key);
                  const el = document.getElementById(`section-${section.key}`);
                  el?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeSection === section.key
                    ? "bg-navy text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
              >
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${statusColors[sections[section.key].status]}`}
                />
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Sections */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="space-y-12">
          {SECTIONS.map((section) => {
            const state = sections[section.key];
            return (
              <div key={section.key} id={`section-${section.key}`}>
                <SectionContainer
                  title={section.title}
                  subtitle={section.subtitle}
                  status={state.status}
                  error={state.error}
                  onRefresh={() => onRefresh(section.key)}
                >
                  {section.key === "overview" && sections.overview.data && (
                    <OverviewSection data={sections.overview.data} />
                  )}
                  {section.key === "market" && sections.market.data && (
                    <MarketSection data={sections.market.data} />
                  )}
                  {section.key === "people" && sections.people.data && (
                    <PeopleSection data={sections.people.data} />
                  )}
                  {section.key === "perception" && sections.perception.data && (
                    <PerceptionSection data={sections.perception.data} />
                  )}
                  {section.key === "financial" && sections.financial.data && (
                    <FinancialSection data={sections.financial.data} />
                  )}
                  {section.key === "fit" && sections.fit.data && (
                    <FitSection data={sections.fit.data} />
                  )}
                </SectionContainer>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
