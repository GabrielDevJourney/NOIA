import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroConvergence } from "@/components/landing/hero-convergence";
import type { ConnectionWithCards } from "@/lib/types";

const realExample: ConnectionWithCards = {
  id: "landing-example",
  card_id_1: "",
  card_id_2: "",
  concept_name: "Redirection Playground",
  definition:
    "A mental space where traits can be tested in different directions without consequences, like trying bullying versus helping before choosing a path.",
  no_connection: false,
  created_at: new Date().toISOString(),
  card_1: null,
  card_2: null,
};

const HOW_IT_WORKS = [
  { number: "01", label: "add notes you've already saved" },
  { number: "02", label: "the app picks two" },
  { number: "03", label: "get back one new concept connecting them" },
];

export default function LandingPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col px-6 pb-24 pt-6 sm:pt-8">
      <nav className="flex h-16 items-center sm:h-[72px]">
        <span className="font-serif text-2xl italic tracking-tight text-foreground">
          NOIA
        </span>
      </nav>

      <section className="flex flex-col items-center pt-10">
        <HeroConvergence example={realExample} />
      </section>

      <section className="pt-20 text-center sm:pt-24">
        <p className="mx-auto max-w-[16ch] font-serif text-4xl italic leading-[1.15] text-foreground sm:max-w-[20ch] sm:text-5xl">
          two notes. one idea you didn&apos;t see coming.
        </p>
        <p className="mx-auto mt-6 max-w-[60ch] text-base leading-relaxed text-muted-foreground">
          People collect ideas constantly and almost never revisit them. Nobody
          rereads forty old notes looking for what connects. The volume that
          makes revisiting valuable is exactly what makes it impractical to do
          by hand.
        </p>
      </section>

      <section className="pt-16 sm:pt-20">
        <div className="mx-auto flex max-w-[65ch] flex-col gap-3">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.number} className="flex items-baseline gap-3">
              <span className="font-sans text-xs text-muted-foreground">
                {step.number}
              </span>
              <span className="text-base text-foreground">{step.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20 flex flex-col items-center text-center sm:mt-24">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "default" }), "h-11 px-6 text-base")}
        >
          Open the app
        </Link>
      </section>

      <footer className="pt-16 text-xs text-muted-foreground">
        <p>
          NOIA — Gabriel Pereira ·{" "}
          <a
            href="https://github.com/GabrielDevJourney/NOIA"
            className="underline underline-offset-2 hover:text-foreground"
            target="_blank"
            rel="noreferrer"
          >
            github.com/GabrielDevJourney/NOIA
          </a>
        </p>
      </footer>
    </div>
  );
}
