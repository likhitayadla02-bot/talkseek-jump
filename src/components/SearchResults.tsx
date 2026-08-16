import { Link } from "@tanstack/react-router";
import { formatTime, type SearchHit } from "@/lib/talks";

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-accent/30 px-0.5 text-foreground">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export function SearchResults({ hits, query }: { hits: SearchHit[]; query: string }) {
  if (!query.trim()) return null;

  if (hits.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        No moments matched “{query}”. Try another word or phrase.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {hits.length} moment{hits.length === 1 ? "" : "s"} found across{" "}
        {new Set(hits.map((h) => h.talk.id)).size} talk
        {new Set(hits.map((h) => h.talk.id)).size === 1 ? "" : "s"}
      </p>
      <ul className="space-y-2">
        {hits.map((hit) => (
          <li key={`${hit.talk.id}-${hit.index}`}>
            <Link
              to="/talk/$talkId"
              params={{ talkId: hit.talk.id }}
              search={{ t: hit.cue.t }}
              className="group flex gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent hover:bg-secondary"
            >
              <span className="mt-0.5 shrink-0 rounded-md bg-accent px-2 py-1 font-mono text-xs font-semibold text-accent-foreground">
                {formatTime(hit.cue.t)}
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {hit.talk.title}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-card-foreground">
                  <Highlight text={hit.cue.text} query={query} />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
