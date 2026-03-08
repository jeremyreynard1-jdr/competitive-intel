import { NextRequest, NextResponse } from "next/server";
import { researchOverview } from "@/lib/research/overview";
import { getReport, saveReport } from "@/lib/storage";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { companyName, reportId } = await req.json();

    if (!companyName) {
      return NextResponse.json(
        { error: "companyName is required" },
        { status: 400 }
      );
    }

    const data = await researchOverview(companyName);

    // Save to report if reportId provided
    if (reportId) {
      const report = await getReport(reportId);
      if (report) {
        report.sections.overview = data;
        await saveReport(report);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Overview research failed:", error);
    return NextResponse.json(
      { error: "Research failed. Please try again." },
      { status: 500 }
    );
  }
}
