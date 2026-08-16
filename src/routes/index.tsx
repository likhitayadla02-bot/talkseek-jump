import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchResults } from "@/components/SearchResults";
import { loadTalks, searchTalks, type Talk } from "@/lib/talks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TalkFind — Search inside recorded talks" },
      {
        name: "description",
        content:
          "Upload workshops, lectures and panels, get timestamped transcripts, and jump straight to the moment any phrase was spoken.",
      },
      { property: "og:title", content: "TalkFind — Search inside recorded talks" },
      {
        property: "og:description",
        content:
          "Search every word of your recorded talks and jump straight to that moment in the video.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => setTalks(loadTalks()), []);

  const hits = useMemo(() => searchTalks(talks, query), [talks, query]);

  return (
    <main>
      <section className="border-b border-border bg-primary">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Searchable talk archive
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-primary-foreground sm:text-5xl">
            Find the exact moment it was said.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/70">
            Upload a workshop, lecture or panel. TalkFind transcribes the speech with
            timestamps so any word takes you straight to that point in the video.
          </p>
          <div className="mx-auto mt-8 flex max-w-xl gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across all transcripts…"
              aria-label="Search transcripts"
              className="h-12 border-transparent bg-card text-base"
            />
            <Button asChild size="lg" variant="secondary" className="h-12">
              <Link to="/upload">Upload</Link>
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-primary-foreground/60">
            <span>Try:</span>
            {["trust", "onboarding", "code review", "transparency"].map((s) => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                className="rounded-full border border-primary-foreground/20 px-3 py-1 transition-colors hover:border-accent hover:text-accent"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 py-12">
        {query.trim() ? (
          <SearchResults hits={hits} query={query} />
        ) : (
          <>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Library
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {talks.length} talk{talks.length === 1 ? "" : "s"} transcribed
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {talks.map((talk) => (
                <li key={talk.id}>
                  <Link
                    to="/talk/$talkId"
                    params={{ talkId: talk.id }}
                    search={{ t: 0 }}
                    className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent hover:shadow-md"
                  >
                    <span className="text-xs font-medium uppercase tracking-wide text-accent-foreground/70">
                      {talk.duration} · {talk.cues.length} segments
                    </span>
                    <span className="mt-2 font-display text-lg font-semibold text-card-foreground">
                      {talk.title}
                    </span>
                    <span className="mt-1 text-sm text-muted-foreground">{talk.speaker}</span>
                    <span className="mt-4 line-clamp-2 text-sm text-muted-foreground/80">
                      “{talk.cues[0]?.text}”
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </main>
  );
}
