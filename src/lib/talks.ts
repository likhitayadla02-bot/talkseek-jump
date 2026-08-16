export type Cue = { t: number; text: string };

export type Talk = {
  id: string;
  title: string;
  speaker: string;
  duration: string;
  videoUrl: string;
  createdAt: number;
  cues: Cue[];
};

const SEED: Talk[] = [
  {
    id: "designing-for-trust",
    title: "Designing for Trust in AI Products",
    speaker: "Maya Rodriguez",
    duration: "14:32",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    createdAt: Date.parse("2026-05-12"),
    cues: [
      { t: 0, text: "Good morning everyone, and thanks for joining this workshop on designing for trust." },
      { t: 8, text: "Trust is not a feature you ship at the end. It is the accumulation of small, honest interactions." },
      { t: 17, text: "The first principle is transparency: tell people what the model can and cannot do." },
      { t: 26, text: "Our research showed that users forgive errors far more easily when uncertainty is shown up front." },
      { t: 35, text: "Second principle: recoverability. Every automated action needs a visible undo." },
      { t: 44, text: "We ran a study with two hundred participants comparing confidence scores against plain language hedging." },
      { t: 53, text: "Plain language won by a wide margin. Nobody knows what seventy-two percent confidence means in practice." },
      { t: 62, text: "Third principle: attribution. Always link back to the source document or the original timestamp." },
      { t: 71, text: "That is exactly why search inside recorded media matters so much for accountability." },
      { t: 80, text: "Let's look at a few interface patterns that make uncertainty legible without being alarming." },
      { t: 92, text: "Notice the muted amber highlight here — it signals review needed rather than error." },
      { t: 104, text: "To close: trust compounds. Ship small honest behaviors and the product feels reliable." },
    ],
  },
  {
    id: "scaling-teams-panel",
    title: "Panel: Scaling Engineering Teams Past 50",
    speaker: "Devon Park, Aisha Khan, Tomás Ferreira",
    duration: "11:05",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    createdAt: Date.parse("2026-06-02"),
    cues: [
      { t: 0, text: "Welcome to the panel. Let's start with the hardest part of scaling: communication overhead." },
      { t: 9, text: "At around thirty people, the informal hallway channel simply stops working." },
      { t: 18, text: "We introduced written decision records and it cut meeting time almost in half." },
      { t: 27, text: "Hiring is the easy part. Onboarding is where most teams quietly lose momentum." },
      { t: 36, text: "Our onboarding buddy program reduced time to first production deploy from three weeks to four days." },
      { t: 46, text: "A question from the audience: how do you keep code review from becoming a bottleneck?" },
      { t: 55, text: "We cap review scope. Anything over four hundred lines gets split, no exceptions." },
      { t: 64, text: "Culture is the set of behaviors you tolerate, not the values written on the wall." },
      { t: 73, text: "On remote work: we optimize for asynchronous by default, with two overlap hours." },
      { t: 83, text: "Metrics we actually track: deploy frequency, change failure rate, and onboarding time." },
      { t: 94, text: "Final advice: document the boring things. Future you is a different person entirely." },
    ],
  },
];

const KEY = "talkfind.talks.v1";

export function loadTalks(): Talk[] {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(KEY);
    const custom: Talk[] = raw ? JSON.parse(raw) : [];
    return [...custom, ...SEED];
  } catch {
    return SEED;
  }
}

export function saveTalk(talk: Talk) {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(KEY);
  const custom: Talk[] = raw ? JSON.parse(raw) : [];
  window.localStorage.setItem(KEY, JSON.stringify([talk, ...custom]));
}

export function getTalk(id: string): Talk | undefined {
  return loadTalks().find((t) => t.id === id);
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export type SearchHit = {
  talk: Talk;
  cue: Cue;
  index: number;
};

export function searchTalks(talks: Talk[], query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: SearchHit[] = [];
  for (const talk of talks) {
    talk.cues.forEach((cue, index) => {
      if (cue.text.toLowerCase().includes(q)) hits.push({ talk, cue, index });
    });
  }
  return hits;
}

/** Mock transcription: produces plausible cues for an uploaded file. */
export function mockTranscribe(title: string): Cue[] {
  const lines = [
    `Welcome, and thank you for joining the session on ${title}.`,
    "Let's begin with a short overview of the agenda for today.",
    "The first topic covers the fundamentals and why they still matter.",
    "Here is a practical example drawn from a recent project.",
    "Notice how the workflow changes once the feedback loop gets shorter.",
    "A question came up about tooling, so let's address that directly.",
    "The measurement approach we use tracks three simple indicators.",
    "This next section is the part most teams skip, and it costs them later.",
    "Let's summarize the key takeaways before we open up for questions.",
    "Thanks everyone — the slides and transcript will be shared afterwards.",
  ];
  return lines.map((text, i) => ({ t: i * 27, text }));
}
