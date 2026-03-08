"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NewResearchForm } from "@/components/dashboard/NewResearchForm";
import { ReportList } from "@/components/dashboard/ReportList";
import type { Report } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/research")
      .then((res) => res.json())
      .then(setReports)
      .catch(console.error);
  }, []);

  const handleSubmit = async (companyName: string, role?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, role }),
      });

      if (!res.ok) throw new Error("Failed to create report");

      const report = (await res.json()) as Report;
      router.push(`/research/${report.id}?new=true`);
    } catch (error) {
      console.error("Failed to start research:", error);
      setIsLoading(false);
    }
  };

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

        {/* Search Form */}
        <NewResearchForm onSubmit={handleSubmit} isLoading={isLoading} />

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
