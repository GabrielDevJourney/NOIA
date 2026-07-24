"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ConnectionWithCards } from "@/lib/types";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const FRAGMENT_A = "…a shitty data set, guilt and regret.";
const FRAGMENT_B = "…people i am around and people i would like to be around.";

const ASCII_DIAGRAM = `┌─ note ─┐   ┌─ note ─┐
│ …regret │ + │ …people │
└────┬────┘   └────┬────┘
     └──────┬───────┘
      ┌─────▼──────────┐
      │  Redirection    │
      │  Playground     │
      └─────────────────┘`;

// The fragments must sit still long enough to actually be read (two short
// sentences, two saccades) before the convergence begins.
const HOLD_MS = 4200;
const CONVERGE_MS = HOLD_MS + 150;
const RESOLVE_MS = CONVERGE_MS + 750;

type Stage = "rest" | "converge" | "resolved";
type GlowStage = "hidden" | "bloom" | "breathe";

export function HeroConvergence({ example }: { example: ConnectionWithCards }) {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>("rest");
  const [glowStage, setGlowStage] = useState<GlowStage>("hidden");

  useEffect(() => {
    const t1 = reduceMotion ? undefined : setTimeout(() => setGlowStage("bloom"), HOLD_MS);
    const t2 = setTimeout(() => setStage("converge"), CONVERGE_MS);
    const t3 = setTimeout(() => setStage("resolved"), RESOLVE_MS);
    return () => {
      if (t1) clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [reduceMotion]);

  // Reduced motion still gets the two-fragments-become-one story: fragments
  // hold, then cut via opacity only (no position/scale/glow motion).
  const glowAnimate = reduceMotion
    ? { opacity: 0 }
    : glowStage === "hidden"
      ? { opacity: 0, scale: 0.5 }
      : glowStage === "bloom"
        ? { opacity: [0, 0.6, 0.42], scale: [0.5, 1.15, 1] }
        : { opacity: [0.42, 0.58, 0.42], scale: [1, 1.05, 1] };

  const glowTransition =
    !reduceMotion && glowStage === "breathe"
      ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" as const }
      : { duration: 0.5, ease: EASE_OUT };

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-8">
      <div className="relative h-64 w-full sm:h-72">
        <AnimatePresence mode="wait">
          {stage !== "resolved" ? (
            <motion.div
              key="convergence"
              className="absolute inset-0"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <motion.div
                  className="h-40 w-40 rounded-full bg-primary blur-3xl"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={glowAnimate}
                  transition={glowTransition}
                  onAnimationComplete={() => {
                    if (!reduceMotion) setGlowStage((s) => (s === "bloom" ? "breathe" : s));
                  }}
                />
              </div>

              <div className="absolute left-0 top-1/2 w-[45%] max-w-sm -translate-y-1/2 sm:left-4">
                <motion.div
                  className="rounded-xl border border-border bg-card p-5 text-base font-sans text-card-foreground shadow-sm sm:p-6"
                  initial={{ x: 0, rotate: reduceMotion ? 0 : -2, scale: 1, opacity: 1 }}
                  animate={
                    stage === "rest"
                      ? { x: 0, rotate: reduceMotion ? 0 : -2, scale: 1, opacity: 1 }
                      : reduceMotion
                        ? { x: 0, rotate: 0, scale: 1, opacity: 0 }
                        : { x: 72, rotate: 0, scale: 0.5, opacity: 0 }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0.3, ease: "easeInOut" as const }
                      : { type: "spring", bounce: 0, duration: 0.35 }
                  }
                >
                  <p className="line-clamp-4 leading-relaxed">{FRAGMENT_A}</p>
                </motion.div>
              </div>

              <div className="absolute right-0 top-1/2 w-[45%] max-w-sm -translate-y-1/2 sm:right-4">
                <motion.div
                  className="rounded-xl border border-border bg-card p-5 text-base font-sans text-card-foreground shadow-sm sm:p-6"
                  initial={{ x: 0, rotate: reduceMotion ? 0 : 2, scale: 1, opacity: 1 }}
                  animate={
                    stage === "rest"
                      ? { x: 0, rotate: reduceMotion ? 0 : 2, scale: 1, opacity: 1 }
                      : reduceMotion
                        ? { x: 0, rotate: 0, scale: 1, opacity: 0 }
                        : { x: -72, rotate: 0, scale: 0.5, opacity: 0 }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0.3, ease: "easeInOut" as const }
                      : { type: "spring", bounce: 0, duration: 0.35 }
                  }
                >
                  <p className="line-clamp-4 leading-relaxed">{FRAGMENT_B}</p>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <div key="resolved" className="absolute inset-0 flex items-center justify-center">
              <ResolvedCard reduceMotion={!!reduceMotion} />
            </div>
          )}
        </AnimatePresence>
      </div>

      <CtaLink />
    </div>
  );
}

function ResolvedCard({ reduceMotion }: { reduceMotion?: boolean }) {
  return (
    <motion.div
      initial={
        reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85, filter: "blur(20px)" }
      }
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={
        reduceMotion
          ? { duration: 0.25 }
          : { type: "spring", bounce: 0.15, duration: 0.55 }
      }
      className="w-full max-w-sm rounded-xl border border-border bg-card px-8 py-10 text-center sm:px-12 sm:py-14"
    >
      <p className="pb-1 font-serif text-2xl italic leading-[1.15] text-card-foreground sm:text-3xl">
        NOIA
      </p>
      <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
        two of your own notes, one new concept.
      </p>
    </motion.div>
  );
}

function CtaLink() {
  return (
    <Link
      href="/"
      className={cn(buttonVariants({ variant: "default" }), "h-11 px-6 text-base")}
    >
      Open the app
    </Link>
  );
}
