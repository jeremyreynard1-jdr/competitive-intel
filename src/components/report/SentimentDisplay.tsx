"use client";

import type { PublicPerception } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

interface SentimentDisplayProps {
  data: PublicPerception;
}

function SentimentMeter({ score }: { score: number }) {
  const percentage = (score / 10) * 100;
  const color =
    score >= 7
      ? "bg-emerald"
      : score >= 5
        ? "bg-amber"
        : "bg-red";

  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-navy">{score}/10</span>
    </div>
  );
}

export function SentimentDisplay({ data }: SentimentDisplayProps) {
  return (
    <div className="space-y-8">
      {/* Overall Sentiment */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Overall Sentiment
        </p>
        <p className="mt-2 text-sm text-slate-700">{data.overallSentiment}</p>
        <div className="mt-3">
          <SentimentMeter score={data.sentimentScore} />
        </div>
      </div>

      {/* Reddit */}
      {data.redditDiscussions.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Reddit Discussions
          </h3>
          <div className="space-y-3">
            {data.redditDiscussions.map((item, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-2">
                  <Badge variant={item.sentiment}>{item.sentiment}</Badge>
                  <span className="text-xs text-slate-400">{item.source}</span>
                  {item.date && (
                    <span className="text-xs text-slate-400">{item.date}</span>
                  )}
                </div>
                <p className="mt-2 text-sm font-medium text-navy">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-slate-600">{item.content}</p>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-emerald hover:underline"
                  >
                    View thread
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Summary */}
      {data.reviews && data.reviews.platforms.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Reviews
          </h3>
          <div className="rounded-lg border border-slate-200 p-5">
            <div className="flex items-center gap-4">
              {data.reviews.averageRating && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-navy">
                    {data.reviews.averageRating}
                  </p>
                  <p className="text-xs text-slate-400">avg rating</p>
                </div>
              )}
              {data.reviews.totalReviews && (
                <div className="text-center">
                  <p className="text-2xl font-bold text-navy">
                    {data.reviews.totalReviews}
                  </p>
                  <p className="text-xs text-slate-400">reviews</p>
                </div>
              )}
              <div className="flex flex-wrap gap-1">
                {data.reviews.platforms.map((p, i) => (
                  <Badge key={i}>{p}</Badge>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              {data.reviews.themes.positive.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-dark">
                    Positive Themes
                  </p>
                  <ul className="mt-1 space-y-1">
                    {data.reviews.themes.positive.map((t, i) => (
                      <li key={i} className="text-xs text-slate-600">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {data.reviews.themes.negative.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-red">
                    Negative Themes
                  </p>
                  <ul className="mt-1 space-y-1">
                    {data.reviews.themes.negative.map((t, i) => (
                      <li key={i} className="text-xs text-slate-600">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Videos */}
      {data.videos.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Videos & Speaking
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {data.videos.map((video, i) => (
              <div key={i} className="rounded-lg border border-slate-200 overflow-hidden">
                {video.embedUrl ? (
                  <div className="aspect-video">
                    <iframe
                      src={video.embedUrl}
                      title={video.title}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-slate-100">
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-emerald hover:underline"
                    >
                      Watch Video
                    </a>
                  </div>
                )}
                <div className="p-3">
                  <h4 className="text-sm font-medium text-navy line-clamp-2">
                    {video.title}
                  </h4>
                  {video.speaker && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      {video.speaker}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Press Coverage */}
      {data.pressCoverage.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Press Coverage
          </h3>
          <div className="space-y-2">
            {data.pressCoverage.map((item, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-4 rounded-lg border border-slate-100 p-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={item.sentiment}>{item.sentiment}</Badge>
                    <span className="text-xs text-slate-400">
                      {item.source}
                    </span>
                    <span className="text-xs text-slate-300">{item.date}</span>
                  </div>
                  <p className="mt-1 text-sm text-navy">{item.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {item.summary}
                  </p>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-xs text-emerald hover:underline"
                >
                  Read
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
