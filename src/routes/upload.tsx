import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockTranscribe, parseYouTubeId, saveTalk, type Talk } from "@/lib/talks";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload a talk — TalkFind" },
      {
        name: "description",
        content:
          "Upload a recorded workshop, lecture or panel — or paste a YouTube link — and TalkFind builds a timestamped, searchable transcript.",
      },
      { property: "og:title", content: "Upload a talk — TalkFind" },
      {
        property: "og:description",
        content:
          "Add a recording or a YouTube link and get a searchable transcript with jump-to-moment timestamps.",
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
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [source, setSource] = useState<"file" | "youtube">("file");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "working">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) return;

    let videoUrl = "";
    let youtubeId: string | undefined;

    if (source === "youtube") {
      const id = parseYouTubeId(youtubeUrl);
      if (!id) {
        setError("That doesn't look like a YouTube link. Paste a youtube.com or youtu.be URL.");
        return;
      }
      youtubeId = id;
      videoUrl = `https://www.youtube.com/watch?v=${id}`;
    } else {
      if (!file) {
        setError("Choose a video file to upload.");
        return;
      }
      videoUrl = URL.createObjectURL(file);
    }

    setStatus("working");
    const id = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}-${Date.now()
      .toString(36)
      .slice(-4)}`;
    const talk: Talk = {
      id,
      title: title.trim(),
      speaker: speaker.trim() || "Unknown speaker",
      duration: "—",
      videoUrl,
      ...(youtubeId ? { youtubeId } : {}),
      createdAt: Date.now(),
      cues: mockTranscribe(title.trim()),
    };
    setTimeout(() => {
      saveTalk(talk);
      navigate({ to: "/talk/$talkId", params: { talkId: id }, search: { t: 0 } });
    }, 1400);
  };

  const ytPreviewId = parseYouTubeId(youtubeUrl);

  return (
    <main className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
        Add a talk
      </h1>
      <p className="mt-2 text-muted-foreground">
        Upload a recording or paste a YouTube link — TalkFind builds a timestamped transcript you
        can search.
      </p>

      <form
        onSubmit={submit}
        className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-6"
      >
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

        <Tabs value={source} onValueChange={(v) => setSource(v as "file" | "youtube")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">Video file</TabsTrigger>
            <TabsTrigger value="youtube">YouTube link</TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="mt-4 space-y-2">
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
          </TabsContent>

          <TabsContent value="youtube" className="mt-4 space-y-3">
            <Label htmlFor="youtube">YouTube URL</Label>
            <Input
              id="youtube"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=…"
            />
            {ytPreviewId ? (
              <div className="overflow-hidden rounded-xl border border-border">
                <img
                  src={`https://img.youtube.com/vi/${ytPreviewId}/hqdefault.jpg`}
                  alt="Thumbnail preview of the linked YouTube talk"
                  className="aspect-video w-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Works with youtube.com/watch, youtu.be, /embed and /shorts links.
              </p>
            )}
          </TabsContent>
        </Tabs>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" size="lg" disabled={status === "working"} className="w-full">
          {status === "working" ? "Transcribing…" : "Add & transcribe"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Demo mode: transcription is simulated so you can try search and jump-to-timestamp right
          away.
        </p>
      </form>
    </main>
  );
}
