# NOIA — Concept, Flow, Test

## The idea

An app that takes two of your own personal notes — written at different times, on unrelated topics — and generates one compressed concept connecting them: a short original name plus a specific definition. Not a summary of either note. Not a quote. A third thing that only exists because the two were put next to each other.

The bet: your own past thinking, reread in the right pairs, surfaces patterns you can't see by rereading linearly or by memory. Nobody rereads 40 old notes looking for intersections. The app does the one thing volume of notes makes possible but nobody has time to do manually.

## Who it's for

People who already write reflective notes in volume — journaling, Notion, Obsidian, Day One. Not people you'd need to convert into journalers first. The input has to already exist for the output to work. Realistically: an audience adjacent to Readwise's — people who follow Hormozi/DOAC/Naval-adjacent thinking and already believe their own past thoughts are worth revisiting.

Niche, not mass.

## What it isn't

Not a note-taking app. Not a journaling-prompt app. Not a quote-of-the-day wisdom generator. If it slides into any of those categories it competes on ground it loses. The only defensible territory is: connects two of *your own* real thoughts, specifically, not generic wisdom.

## Product flow (as currently scoped, untested at product level)

1. **Input** — user has a bank of existing notes (cards). No new writing required to use the feature; it draws on what's already there.
2. **Daily surfacing** — each day, the app selects two notes. First pass: random. Later possibly weighted (recency, tag, domain) once random is proven not to be noise.
3. **Generation** — the two notes are sent to a model with a fixed prompt (below). Output is exactly two things: a short coined name (2-3 words, plain English, not a borrowed foreign term) and one specific definition (hard capped at 25 words) that must reference an actual detail from each note.
4. **Delivery** — user sees the card once. No explanation, no reasoning shown, no "here's why I connected these." Just the name and the definition.
5. **Fallback** — if no real connection exists, the app says so explicitly ("no real connection here") rather than forcing an insight. This is a deliberate quality floor, not a bug — false connections are worse than an honest miss.

Nothing past step 5 (saving cards, revisiting past connections, weighting/personalization, social/sharing) is designed yet. Deliberately — building any of that before the core mechanic is proven would be repeating the Unsaid mistake: designing surface area around an unvalidated core.

## The prompt (final version tested)

```
You will be given two short personal notes, written by the same person at
different times, on unrelated topics.

Privately find one real, specific connection between them — not a vague
thematic link, not generic wisdom.

Output two things only:
1. A short original name for the concept at the intersection — two or three
words, coined in plain English, not borrowed from a specific culture or
language, not a fabricated foreign term.
2. One sentence (max 25 words) defining what it means, specific to what
these two notes actually reveal. The definition must reference at least one
specific detail from each note (an action, phrase, or claim actually
written) — not an abstraction that could describe other notes.

If the two notes genuinely don't connect beyond surface coincidence, output
exactly: "no real connection here."

Never use the words "journey," "mindset," or "self-care." Never moralize.

Note A: [paste]
Note B: [paste]
```

This is the fourth iteration. Each earlier version failed a specific way:

- **V1** (3-sentence reasoning + question) — worked, but output was a mini-essay, not a daily object. Felt like analysis, not a card.
- **V2** (question-only) — tighter, but the question format is confrontational as a *daily* mechanic. Fine once, exhausting on repeat.
- **V3** (question, cornering constraint added) — fixed the "yes/no/it depends" escape hatch problem, still a question-format card, same daily-fatigue issue.
- **V4** (concept-name + definition) — solved the daily-object problem, but first pass produced a generic-sounding definition with no word cap ("a personal standard only becomes durable when repeated actions create evidence that survives your own changing explanations...") — passed the vibe check, failed the specificity check. Added the 25-word cap and the "must reference a specific detail from each note" rule. Second pass produced a definition that actually named note-specific details (reinterpreting failure after the fact / distraction passing as almost-doing) — first output that cleared the bar.

## The test that was run

**Method:** four of your own real notes (routine/self-accountability/porn-netflix-avoidance/Instagram-Hormozi) were randomly paired — no cherry-picking pairs that already felt connected. One pair (note 1 + note 2, routine-as-proof and self-accountability's structural blind spot) was run through the prompt live in this conversation.

**Result:** name "Story Slack," definition: *"The room you give yourself to quietly lower the bar or swap the real work for something that resembles it, because no one outside your own head is holding the definition fixed — in note A it lets failure get reinterpreted after the fact, in note B it lets distraction pass as almost-doing."*

**Assessment:** the definition passed the specificity bar (named actual content from both notes) but ran roughly double the word cap (~55 words vs. 25), meaning the cap needs enforcement, not just instruction — likely a re-prompt-if-over-length step, or truncation logic, at the product level. The name was judged a partial miss: "Story Slack" reads as generic looseness rather than the specific "you're the only one who can move the goalpost" mechanic the definition describes. Candidate fixes discussed: "Unwitnessed Bar," "Solo Judge" — closer to what the definition actually says.

**What has NOT been tested yet:**
- The other pairs from the same 4-note set (2+3, 2+4, 3+4, 1+3, 1+4)
- Blind reaction from anyone other than you — no output has been shown to Cathy or anyone else without context
- The single question that matters: "would you open this again tomorrow"
- Whether the 25-word cap holds consistently across pairs, or whether this one output was an outlier

## Where this actually stands

One tuned prompt, one manually-run pair, zero outside eyes. That's the entire test to date. The plan discussed and not yet executed: run the same prompt across the remaining pairs from the 4-note set (or expand to 10-15 notes), strip identifying context, send blind to 3 people, and count how many pairs get a "yes, I'd open this again" versus how many read as noise. Under half — the mechanic isn't there yet, regardless of app polish. That test has not been run.
