import { NextRequest, NextResponse } from "next/server";
import { researchFit } from "@/lib/research/fit";
import { getReport, saveReport } from "@/lib/storage";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { companyName, reportId, role, context } = await req.json();

    if (!companyName) {
      return NextResponse.json(
        { error: "companyName is required" },
        { status: 400 }
      );
    }

    const data = await researchFit(companyName, role, context);

    if (reportId) {
      const report = await getReport(reportId);
      if (report) {
        report.sections.fit = data;
        await saveReport(report);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Fit research failed:", error);
    return NextResponse.json(
      { error: "Research failed. Please try again." },
      { status: 500 }
    );
  }
}
