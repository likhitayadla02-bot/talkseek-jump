import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockTranscribe, saveTalk } from "@/lib/talks";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload a talk — TalkFind" },
      {
        name: "description",
        content:
          "Upload a recorded workshop, lecture, or panel and TalkFind builds a timestamped, searchable transcript.",
      },
      { property: "og:title", content: "Upload a talk — TalkFind" },
      {
        property: "og:description",
        content: "Add a recording and get a searchable transcript with jump-to-moment timestamps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "working">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !file) return;
    setStatus("working");
    const id = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}-${Date.now()
      .toString(36)
      .slice(-4)}`;
    const cues = mockTranscribe(title.trim());
    const talk = {
      id,
      title: title.trim(),
      speaker: speaker.trim() || "Unknown speaker",
      duration: "—",
      videoUrl: URL.createObjectURL(file),
      createdAt: Date.now(),
      cues,
    };
    setTimeout(() => {
      saveTalk(talk);
      navigate({ to: "/talk/$talkId", params: { talkId: id }, search: { t: 0 } });
    }, 1400);
  };

  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
        Upload a talk
      </h1>
      <p className="mt-2 text-muted-foreground">
        Add a recording and TalkFind builds a timestamped transcript you can search.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="title">Session title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Designing for Trust in AI Products"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="speaker">Speaker(s)</Label>
          <Input
            id="speaker"
            value={speaker}
            onChange={(e) => setSpeaker(e.target.value)}
            placeholder="e.g. Maya Rodriguez"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="video">Video file</Label>
          <label
            htmlFor="video"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-secondary/50 px-6 py-10 text-center transition-colors hover:border-accent"
          >
            <span className="text-sm font-medium text-foreground">
              {file ? file.name : "Choose a video file"}
            </span>
            <span className="text-xs text-muted-foreground">MP4, MOV or WebM</span>
          </label>
          <input
            id="video"
            type="file"
            accept="video/*"
            className="sr-only"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <Button type="submit" size="lg" disabled={status === "working"} className="w-full">
          {status === "working" ? "Transcribing…" : "Upload & transcribe"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Demo mode: transcription is simulated so you can try search and jump-to-timestamp right away.
        </p>
      </form>
    </main>
  );
}
