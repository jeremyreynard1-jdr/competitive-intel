import { searchMultiple } from "@/lib/tavily";
import { analyzeWithClaude } from "@/lib/anthropic";
import { FIT_SYSTEM_PROMPT } from "./prompts";
import { getProfile } from "@/lib/storage";
import type { StrategicFit, Report } from "@/lib/types";

export async function researchFit(
  companyName: string,
  role?: string,
  reportContext?: Partial<Report["sections"]>
): Promise<StrategicFit> {
  const queries = [
    `${companyName} chief of staff head of operations business operations`,
    `${companyName} head of people HR VP people team`,
    `${companyName} organizational challenges growing pains scaling`,
    { query: `${companyName} strategic priorities goals 2025 2026`, options: { topic: "news" as const, days: 180 } },
    `${companyName} org structure gaps leadership needs hiring`,
  ];

  const { results } = await searchMultiple(queries, 5);
  const profile = await getProfile();

  const searchContext = results
    .map((r) => `[${r.title}](${r.url})\n${r.content}`)
    .join("\n\n---\n\n");

  // Build context from other sections if available
  let sectionContext = "";
  if (reportContext) {
    if (reportContext.overview) {
      sectionContext += `\n\nCOMPANY OVERVIEW:\nDescription: ${reportContext.overview.description}\nEmployee Count: ${reportContext.overview.employeeCount}\nFounded: ${reportContext.overview.founded}\n`;
    }
    if (reportContext.market) {
      sectionContext += `\nCOMPETITIVE RISKS:\n${reportContext.market.competitiveRisks.join("\n- ")}\n`;
      sectionContext += `INDUSTRY TRENDS:\n${reportContext.market.industryTrends.join("\n- ")}\n`;
    }
    if (reportContext.people) {
      const leaders = reportContext.people.leadership
        .map((l) => `${l.name} — ${l.title}`)
        .join("\n");
      sectionContext += `\nCURRENT LEADERSHIP:\n${leaders}\n`;
      sectionContext += `TEAM SIZE: ${reportContext.people.teamSize}\n`;
      sectionContext += `HIRING SIGNALS:\n${reportContext.people.hiringTrends.signals.join("\n- ")}\n`;
    }
  }

  let profileContext = "";
  if (profile) {
    profileContext = `\n\nCANDIDATE PROFILE:
Name: ${profile.name}
Title: ${profile.title}
Summary: ${profile.summary}
Skills:\n${profile.skills.map((s) => `- ${s}`).join("\n")}
Target Roles: ${profile.targetRoles.join(", ")}
Experience:
${profile.experience.map((e) => `- ${e.role} at ${e.company} (${e.duration}): ${e.highlights.join("; ")}`).join("\n")}`;
    if (profile.keyThemes) {
      profileContext += `\n\nKEY THEMES (use these to map candidate strengths to company needs):
${Object.entries(profile.keyThemes).map(([k, v]) => `- ${k}: ${v}`).join("\n")}`;
    }
    if (profile.education) {
      profileContext += `\nEducation: ${profile.education}`;
    }
  }

  const roleContext = role ? `\nTARGET ROLE: ${role}` : "";

  return analyzeWithClaude<StrategicFit>(
    FIT_SYSTEM_PROMPT,
    `Analyze how the candidate can add value to "${companyName}".${roleContext}\n\nWeb research:\n${searchContext}${sectionContext}${profileContext}`
  );
}
