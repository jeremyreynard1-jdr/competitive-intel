# Competitive Intel

## What It Does
AI-powered competitive research tool for company interview prep. Enter a company name, get a comprehensive 6-section strategic research report.

## Tech Stack
- Next.js 14 (App Router), TypeScript, Tailwind CSS v4
- Anthropic Claude API (analysis/synthesis)
- Tavily API (web search)
- File-based storage locally, Vercel KV in production
- Deploy target: Vercel

## Architecture
- Each of the 6 report sections has its own API route (`/api/sections/[section]`)
- Client fires all 6 in parallel, renders progressively as they complete
- "How I Can Help" section depends on other sections' outputs
- Reports saved as JSON in `data/reports/`

## Key Decisions
- No YouTube API — Tavily finds videos, we extract embed IDs
- Fonts: Fraunces (headings), DM Sans (body)
- Port: 3847
- `maxDuration = 60` on API routes for Vercel compatibility

## Sections
1. Company Overview (history, funding timeline, tech stack, news)
2. Market & Competitive Landscape (competitors, positioning, risks, trends)
3. People & Organization (leadership, org chart, hiring, culture)
4. Public Perception (Reddit, reviews, press, videos)
5. Financial Outlook & Exit (revenue, runway, exit strategy)
6. How I Can Help (gap analysis, skill mapping, strategic fit)
