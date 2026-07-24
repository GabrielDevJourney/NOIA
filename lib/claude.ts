import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const MODEL = "claude-sonnet-4-5";
const WORD_CAP = 25;

export type ConnectionResult = {
  name: string | null;
  definition: string | null;
  noConnection: boolean;
};

function buildPrompt(cardA: string, cardB: string) {
  return `You will be given two short personal notes, written by the same person at
different times, on unrelated topics.

Privately find one real, specific connection between them — not a vague
thematic link, not generic wisdom.

Output two things only:

A short original name for the concept at the intersection — two or three
words, coined in plain English, not borrowed from a specific culture or
language, not a fabricated foreign term.
One sentence (max 25 words) defining what it means, specific to what
these two notes actually reveal. The definition must reference at least one
specific detail from each note (an action, phrase, or claim actually
written) — not an abstraction that could describe other notes.

If the two notes genuinely don't connect beyond surface coincidence, output
exactly: "no real connection here."

Never use the words "journey," "mindset," or "self-care." Never moralize.

Note A: ${cardA}
Note B: ${cardB}

Return strict JSON: {"name": string or null, "definition": string or null,
"noConnection": boolean}`;
}

function extractJson(text: string): unknown {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("no JSON object found in response");
  return JSON.parse(match[0]);
}

function wordCount(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

const SMALL_WORDS = new Set([
  "a", "an", "the", "of", "in", "on", "at", "to", "for", "and", "or", "nor", "but",
]);

function titleCase(s: string): string {
  return s
    .split(" ")
    .map((word, i) =>
      i > 0 && SMALL_WORDS.has(word.toLowerCase())
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}

function truncateToWordCap(definition: string, cap: number): string {
  const sentences = definition.match(/[^.!?]+[.!?]*/g) ?? [definition];
  let out = "";
  for (const sentence of sentences) {
    const candidate = (out + sentence).trim();
    if (wordCount(candidate) > cap) break;
    out = candidate + " ";
  }
  out = out.trim();
  if (out) return out;

  const words = definition.trim().split(/\s+/).slice(0, cap);
  return words.join(" ") + "…";
}

async function callClaude(prompt: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 300,
    messages: [{ role: "user", content: prompt }],
  });
  const block = message.content[0];
  return block.type === "text" ? block.text : "";
}

function isValidShape(obj: unknown): obj is ConnectionResult {
  if (typeof obj !== "object" || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    "noConnection" in o &&
    typeof o.noConnection === "boolean" &&
    (o.name === null || typeof o.name === "string") &&
    (o.definition === null || typeof o.definition === "string")
  );
}

export async function generateConnection(
  cardA: string,
  cardB: string
): Promise<ConnectionResult> {
  const prompt = buildPrompt(cardA, cardB);

  let parsed: ConnectionResult | null = null;
  for (let attempt = 0; attempt < 2 && !parsed; attempt++) {
    try {
      const raw = await callClaude(prompt);
      const candidate = extractJson(raw);
      if (isValidShape(candidate)) parsed = candidate;
    } catch {
      // retry once
    }
  }

  if (!parsed) {
    throw new Error("failed to get valid JSON from model after retry");
  }

  if (parsed.noConnection || !parsed.definition) {
    return { name: null, definition: null, noConnection: true };
  }

  let definition = parsed.definition;
  if (wordCount(definition) > WORD_CAP) {
    definition = truncateToWordCap(definition, WORD_CAP);
  }

  const name = parsed.name ? titleCase(parsed.name) : parsed.name;

  return { name, definition, noConnection: false };
}
