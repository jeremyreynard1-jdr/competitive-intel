import { NextRequest, NextResponse } from "next/server";
import { createReport, listReports } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const { companyName, role } = await req.json();

    if (!companyName || typeof companyName !== "string") {
      return NextResponse.json(
        { error: "companyName is required" },
        { status: 400 }
      );
    }

    const report = await createReport(companyName.trim(), role?.trim());
    return NextResponse.json(report);
  } catch (error) {
    console.error("Failed to create report:", error);
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reports = await listReports();
    return NextResponse.json(reports);
  } catch (error) {
    console.error("Failed to list reports:", error);
    return NextResponse.json(
      { error: "Failed to list reports" },
      { status: 500 }
    );
  }
}
