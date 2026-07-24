"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { ConnectionWithCards } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ConceptCard({ connection }: { connection: ConnectionWithCards }) {
  const [open, setOpen] = useState(false);

  if (connection.no_connection) {
    return (
      <div className="flex aspect-[4/5] flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">no real connection here.</p>
      </div>
    );
  }

  const name = connection.concept_name ?? "Untitled concept";
  const definition = connection.definition ?? "";

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        whileHover={{ y: -4, scale: 1.015 }}
        className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-8 text-center shadow-sm transition-shadow duration-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring"
      >
        <p className="pb-1 font-serif text-2xl italic leading-[1.15] text-card-foreground sm:text-3xl">
          {name}
        </p>
        <span className="text-xs text-muted-foreground">tap to see the connection</span>
      </motion.button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="pb-1 font-serif text-3xl leading-[1.15] italic text-card-foreground sm:text-4xl">
              {name}
            </DialogTitle>
            <DialogDescription className="mt-2 text-base leading-relaxed text-muted-foreground">
              {definition}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
