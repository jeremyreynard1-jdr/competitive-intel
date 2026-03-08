import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { Report, UserProfile } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const REPORTS_DIR = path.join(DATA_DIR, "reports");
const PROFILE_PATH = path.join(DATA_DIR, "profile.json");

async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // Directory exists
  }
}

// ---- Reports ----

export async function createReport(
  companyName: string,
  role?: string
): Promise<Report> {
  await ensureDir(REPORTS_DIR);

  const report: Report = {
    id: uuidv4(),
    companyName,
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections: {},
  };

  await saveReport(report);
  return report;
}

export async function saveReport(report: Report): Promise<void> {
  await ensureDir(REPORTS_DIR);
  report.updatedAt = new Date().toISOString();
  const filePath = path.join(REPORTS_DIR, `${report.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(report, null, 2));
}

export async function getReport(id: string): Promise<Report | null> {
  try {
    const filePath = path.join(REPORTS_DIR, `${id}.json`);
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as Report;
  } catch {
    return null;
  }
}

export async function listReports(): Promise<Report[]> {
  await ensureDir(REPORTS_DIR);

  try {
    const files = await fs.readdir(REPORTS_DIR);
    const reports: Report[] = [];

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const data = await fs.readFile(
          path.join(REPORTS_DIR, file),
          "utf-8"
        );
        reports.push(JSON.parse(data) as Report);
      } catch {
        // Skip corrupted files
      }
    }

    return reports.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch {
    return [];
  }
}

export async function deleteReport(id: string): Promise<boolean> {
  try {
    const filePath = path.join(REPORTS_DIR, `${id}.json`);
    await fs.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}

// ---- User Profile ----

export async function getProfile(): Promise<UserProfile | null> {
  try {
    const data = await fs.readFile(PROFILE_PATH, "utf-8");
    const profile = JSON.parse(data) as UserProfile;
    // Return null if profile hasn't been filled in
    if (!profile.name) return null;
    return profile;
  } catch {
    return null;
  }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await ensureDir(DATA_DIR);
  await fs.writeFile(PROFILE_PATH, JSON.stringify(profile, null, 2));
}
