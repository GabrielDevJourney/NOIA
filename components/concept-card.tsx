"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import type { ConnectionWithCards } from "@/lib/types";

export function ConceptCard({ connection }: { connection: ConnectionWithCards }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (connection.no_connection) {
    return (
      <div className="flex aspect-[4/5] flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">no real connection here.</p>
      </div>
    );
  }

  const name = connection.concept_name ?? "Untitled concept";
  const definition = connection.definition ?? "";
  const layoutId = `concept-card-${connection.id}`;

  return (
    <>
      <motion.button
        type="button"
        layoutId={layoutId}
        onClick={() => setOpen(true)}
        whileHover={!open ? { y: -4, scale: 1.015 } : undefined}
        style={{ opacity: open ? 0 : 1 }}
        className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring"
      >
        <motion.p
          layoutId={`${layoutId}-name`}
          className="pb-1 font-serif text-2xl italic leading-[1.15] text-card-foreground sm:text-3xl"
        >
          {name}
        </motion.p>
        <span className="text-xs text-muted-foreground">tap to see the connection</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              onClick={() => setOpen(false)}
            >
              <motion.div
                layoutId={layoutId}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-xl rounded-xl border border-border bg-card px-8 py-12 text-center shadow-xl sm:px-14 sm:py-16"
              >
                <motion.button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2, duration: 0.15 }}
                  className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.5} />
                </motion.button>
                <motion.p
                  layoutId={`${layoutId}-name`}
                  className="pb-1 font-serif text-3xl italic leading-[1.15] text-card-foreground sm:text-4xl"
                >
                  {name}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.15, duration: 0.2 }}
                  className="mt-4 text-lg leading-relaxed text-muted-foreground"
                >
                  {definition}
                </motion.p>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
