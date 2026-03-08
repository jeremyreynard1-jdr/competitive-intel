import { NextRequest, NextResponse } from "next/server";
import { researchPeople } from "@/lib/research/people";
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

    const data = await researchPeople(companyName);

    if (reportId) {
      const report = await getReport(reportId);
      if (report) {
        report.sections.people = data;
        await saveReport(report);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("People research failed:", error);
    return NextResponse.json(
      { error: "Research failed. Please try again." },
      { status: 500 }
    );
  }
}
