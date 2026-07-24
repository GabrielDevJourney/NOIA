"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CircleNotch } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import type { Card, Connection } from "@/lib/types";

type Phase = "idle" | "animating" | "error";

const MIN_ANIMATION_MS = 1450;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

function pickTwoDistinct(list: Card[]): [Card, Card] {
  const i = Math.floor(Math.random() * list.length);
  let j = Math.floor(Math.random() * (list.length - 1));
  if (j >= i) j += 1;
  return [list[i], list[j]];
}

export function ConnectView({ cards }: { cards: Card[] }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("idle");
  const [picked, setPicked] = useState<[Card, Card] | null>(null);
  const [result, setResult] = useState<Connection | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  const mountedRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // The result is ready to reveal only once the minimum animation time has
  // elapsed AND the API response has arrived — whichever finishes last wins.
  const showResult = phase === "animating" && minTimeElapsed && !!result;

  // Refresh other views once (and only once) the reveal actually begins,
  // so it never interrupts the in-flight animation.
  useEffect(() => {
    if (showResult && !revealedRef.current) {
      revealedRef.current = true;
      router.refresh();
    }
    if (!showResult) {
      revealedRef.current = false;
    }
  }, [showResult, router]);

  const handleConnect = useCallback(async () => {
    if (cards.length < 2) return;
    const pair = pickTwoDistinct(cards);

    setPicked(pair);
    setResult(null);
    setErrorMsg(null);
    setMinTimeElapsed(false);
    setPhase("animating");

    timerRef.current = setTimeout(
      () => {
        if (mountedRef.current) setMinTimeElapsed(true);
      },
      reduceMotion ? 0 : MIN_ANIMATION_MS
    );

    try {
      const res = await fetch("/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId1: pair[0].id, cardId2: pair[1].id }),
      });
      const data = await res.json();

      if (!mountedRef.current) return;

      if (!res.ok) {
        throw new Error(
          typeof data?.error === "string" ? data.error : "Something went wrong."
        );
      }

      setResult(data as Connection);
    } catch (err) {
      if (!mountedRef.current) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setPhase("error");
    }
  }, [cards, reduceMotion]);

  const handleRetry = useCallback(() => {
    setPhase("idle");
    setErrorMsg(null);
    setPicked(null);
    setResult(null);
  }, []);

  if (cards.length < 2) {
    return (
      <div className="flex min-h-[16rem] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Add at least 2 notes to make a connection.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-12 shrink-0 items-center justify-end">
        {showResult && (
          <Button onClick={handleConnect} size="sm">
            New concept
          </Button>
        )}
      </div>
      <div className="relative flex min-h-[22rem] w-full flex-1 flex-col items-center justify-center">
        <AnimatePresence initial={false}>
          {phase === "idle" && (
            <motion.div
              key="button"
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="font-serif text-5xl italic text-foreground sm:text-6xl">
                Find a connection
              </h2>
              <p className="max-w-md text-base text-muted-foreground sm:max-w-lg sm:text-lg">
                We&rsquo;ll pick two of your notes at random and look for
                something real connecting them.
              </p>
              <Button onClick={handleConnect} className="mt-2">
                Connect two
              </Button>
            </motion.div>
          )}

          {phase === "animating" && picked && !showResult && (
            <motion.div
              key="animating"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <GatherAnimation
                cardA={picked[0]}
                cardB={picked[1]}
                reduceMotion={!!reduceMotion}
              />
            </motion.div>
          )}

          {showResult && result && (
            <div key="result" className="absolute inset-0 flex items-center justify-center">
              <ResultReveal result={result} reduceMotion={!!reduceMotion} />
            </div>
          )}

          {phase === "error" && (
            <motion.div
              key="error"
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm text-muted-foreground">
                {errorMsg ?? "Something went wrong."}
              </p>
              <Button onClick={handleRetry}>Try again</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function GatherAnimation({
  cardA,
  cardB,
  reduceMotion,
}: {
  cardA: Card;
  cardB: Card;
  reduceMotion: boolean;
}) {
  const [cardStage, setCardStage] = useState<"gather" | "dissolve">("gather");
  const [glowStage, setGlowStage] = useState<"hidden" | "bloom" | "breathe">(
    "hidden"
  );

  useEffect(() => {
    if (reduceMotion) return;
    const t1 = setTimeout(() => setGlowStage("bloom"), 600);
    const t2 = setTimeout(() => setCardStage("dissolve"), 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <div className="flex items-center justify-center gap-2 py-16">
        <CircleNotch className="size-4 text-muted-foreground" weight="bold" />
        <p className="text-sm text-muted-foreground">Finding a connection…</p>
      </div>
    );
  }

  const glowAnimate =
    glowStage === "hidden"
      ? { opacity: 0, scale: 0.5 }
      : glowStage === "bloom"
        ? { opacity: [0, 0.6, 0.42], scale: [0.5, 1.15, 1] }
        : { opacity: [0.42, 0.58, 0.42], scale: [1, 1.05, 1] };

  const glowTransition =
    glowStage === "breathe"
      ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" as const }
      : { duration: 0.5, ease: EASE_OUT };

  return (
    <div className="relative h-64 w-full sm:h-72">
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <filter id="noia-merge-goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence>
          {glowStage === "bloom" && (
            <motion.div
              key="merge-blobs"
              className="absolute inset-0 flex items-center justify-center"
              style={{ filter: "url(#noia-merge-goo)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className="absolute h-20 w-20 rounded-full bg-primary"
                initial={{ x: -64, scale: 0.4, opacity: 0 }}
                animate={{
                  x: [-64, -28, -6],
                  scale: [0.4, 0.75, 0.95],
                  opacity: [0, 1, 1],
                }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              />
              <motion.div
                className="absolute h-20 w-20 rounded-full bg-primary"
                initial={{ x: 64, scale: 0.4, opacity: 0 }}
                animate={{
                  x: [64, 28, 6],
                  scale: [0.4, 0.75, 0.95],
                  opacity: [0, 1, 1],
                }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="h-40 w-40 rounded-full bg-primary blur-3xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={glowAnimate}
          transition={glowTransition}
          onAnimationComplete={() => {
            setGlowStage((s) => (s === "bloom" ? "breathe" : s));
          }}
        />
      </div>

      <div className="absolute left-2 top-1/2 w-[42%] max-w-xs -translate-y-1/2 sm:left-8">
        <motion.div
          className="rounded-xl border border-border bg-card p-4 text-sm text-card-foreground shadow-sm sm:p-5"
          initial={{ x: 0, scale: 1, opacity: 1 }}
          animate={
            cardStage === "gather"
              ? { x: 48, scale: 0.7, opacity: 0.3 }
              : { x: 72, scale: 0.5, opacity: 0 }
          }
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
        >
          <p className="line-clamp-4 leading-relaxed">{cardA.content}</p>
        </motion.div>
      </div>

      <div className="absolute right-2 top-1/2 w-[42%] max-w-xs -translate-y-1/2 sm:right-8">
        <motion.div
          className="rounded-xl border border-border bg-card p-4 text-sm text-card-foreground shadow-sm sm:p-5"
          initial={{ x: 0, scale: 1, opacity: 1 }}
          animate={
            cardStage === "gather"
              ? { x: -48, scale: 0.7, opacity: 0.3 }
              : { x: -72, scale: 0.5, opacity: 0 }
          }
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
        >
          <p className="line-clamp-4 leading-relaxed">{cardB.content}</p>
        </motion.div>
      </div>
    </div>
  );
}

function ResultReveal({
  result,
  reduceMotion,
}: {
  result: Connection;
  reduceMotion: boolean;
}) {
  if (result.no_connection) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0.2 : 0.4 }}
        className="text-center text-sm text-muted-foreground"
      >
        No real connection here — try another pair.
      </motion.p>
    );
  }

  return (
    <motion.div
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.92, filter: "blur(8px)" }
      }
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0 }}
      transition={
        reduceMotion
          ? { duration: 0.25 }
          : { type: "spring", bounce: 0.15, duration: 0.4 }
      }
      className="w-full max-w-2xl rounded-xl border border-border bg-card px-8 py-12 text-center sm:px-14 sm:py-16"
    >
      <p className="pb-1 font-serif text-5xl italic leading-tight tracking-tight text-card-foreground sm:text-6xl">
        {result.concept_name}
      </p>
      <p className="mx-auto mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground">
        {result.definition}
      </p>
    </motion.div>
  );
}
