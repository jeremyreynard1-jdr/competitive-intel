import { NextRequest, NextResponse } from "next/server";
import { researchMarket } from "@/lib/research/market";
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

    const data = await researchMarket(companyName);

    if (reportId) {
      const report = await getReport(reportId);
      if (report) {
        report.sections.market = data;
        await saveReport(report);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Market research failed:", error);
    return NextResponse.json(
      { error: "Research failed. Please try again." },
      { status: 500 }
    );
  }
}
