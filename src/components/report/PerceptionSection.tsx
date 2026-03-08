"use client";

import type { PublicPerception } from "@/lib/types";
import { SentimentDisplay } from "./SentimentDisplay";

interface PerceptionSectionProps {
  data: PublicPerception;
}

export function PerceptionSection({ data }: PerceptionSectionProps) {
  return <SentimentDisplay data={data} />;
}
