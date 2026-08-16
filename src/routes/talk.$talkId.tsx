import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { formatTime, getTalk, type Talk } from "@/lib/talks";

export const Route = createFileRoute("/talk/$talkId")({
  validateSearch: (search: Record<string, unknown>) => ({
    t: Number(search["t"]) || 0,
  }),
  head: () => ({
    meta: [
      { title: "Talk player — TalkFind" },
      {
        name: "description",
        content:
          "Play a recorded talk and jump to any moment using the searchable, timestamped transcript.",
      },
      { property: "og:title", content: "Talk player — TalkFind" },
      {
        property: "og:description",
        content: "Jump straight to the moment a phrase was spoken in a recorded talk.",
      },
      { property: "og:type", content: "video.other" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TalkPage,
});

function TalkPage() {
  const { talkId } = Route.useParams();
  const { t } = Route.useSearch();
  const [talk, setTalk] = useState<Talk | undefined>();
  const [ready, setReady] = useState(false);
  const [current, setCurrent] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setTalk(getTalk(talkId));
    setReady(true);
  }, [talkId]);

  const seek = (seconds: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = seconds;
    void v.play().catch(() => {});
  };

  useEffect(() => {
    if (talk && t > 0) seek(t);
  }, [talk, t]);

  if (!ready) return <div className="p-10 text-muted-foreground">Loading…</div>;
  if (!talk) throw notFound();

  const activeIndex = talk.cues.reduce(
    (acc, cue, i) => (current >= cue.t ? i : acc),
    0,
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to library
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground">
        {talk.title}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {talk.speaker} · {talk.duration}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-border bg-primary shadow-lg">
          <video
            ref={videoRef}
            src={talk.videoUrl}
            controls
            playsInline
            className="aspect-video w-full bg-primary"
            onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
          />
        </div>

        <div className="flex max-h-[70vh] flex-col rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Transcript
            </h2>
          </div>
          <ol className="flex-1 space-y-1 overflow-y-auto p-3">
            {talk.cues.map((cue, i) => (
              <li key={cue.t}>
                <button
                  onClick={() => seek(cue.t)}
                  className={`flex w-full gap-3 rounded-lg p-3 text-left transition-colors ${
                    i === activeIndex
                      ? "bg-accent/15 ring-1 ring-accent"
                      : "hover:bg-secondary"
                  }`}
                >
                  <span className="shrink-0 font-mono text-xs text-accent-foreground/80">
                    {formatTime(cue.t)}
                  </span>
                  <span className="text-sm leading-relaxed text-card-foreground">
                    {cue.text}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  );
}
