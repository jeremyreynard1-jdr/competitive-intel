"use client";

import type { FinancialOutlook } from "@/lib/types";
import { ExitAnalysisDisplay } from "./ExitAnalysis";

interface FinancialSectionProps {
  data: FinancialOutlook;
}

export function FinancialSection({ data }: FinancialSectionProps) {
  return <ExitAnalysisDisplay data={data} />;
}
