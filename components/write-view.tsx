"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp02Icon } from "@hugeicons/core-free-icons";

const MAX_TEXTAREA_HEIGHT = 192; // px (~12rem, roughly 8-9 lines)

/**
 * WriteView — the app's front door. A calm, centered capture composer that
 * inserts directly into the `cards` table and stays mounted for quick,
 * repeated capture (no navigation on submit).
 *
 * Props: none required. Intended to be mounted by Shell for the "write" tab.
 */
export function WriteView() {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  function autoGrow(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT) + "px";
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
    autoGrow(e.target);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    const { error } = await supabase.from("cards").insert({ content });

    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    setContent("");
    router.refresh();

    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
    }

    setShowToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setShowToast(false), 2500);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 pt-[18vh] md:pt-[22vh]">
      <h1 className="font-serif text-3xl italic tracking-tight text-foreground sm:text-4xl">
        what&rsquo;s on your mind.
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            placeholder="start writing…"
            rows={1}
            className={cn(
              "min-h-16 w-full resize-none overflow-y-auto rounded-xl border border-input bg-transparent py-3 pr-14 pl-4 text-base leading-relaxed text-foreground",
              "outline-none transition-colors placeholder:text-muted-foreground",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            )}
            style={{ maxHeight: MAX_TEXTAREA_HEIGHT }}
          />

          <Button
            type="submit"
            size="icon"
            disabled={submitting || !content.trim()}
            className="absolute right-3 bottom-3 rounded-full"
          >
            <HugeiconsIcon icon={ArrowUp02Icon} size={18} strokeWidth={2} />
          </Button>
        </div>

        {error && <p className="text-sm text-muted-foreground">{error}</p>}
      </form>

      <AnimatePresence>
        {showToast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2.5 text-sm text-background shadow-lg"
          >
            Note saved.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
