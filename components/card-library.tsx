"use client";

import { useState } from "react";
import type { Card } from "@/lib/types";
import { formatRelativeTime } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CardLibrary({ cards }: { cards: Card[] }) {
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  return (
    <>
      <div className="mb-8">
        <h2 className="font-serif text-2xl italic text-foreground">
          Library
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Every note you&rsquo;ve written, in one place.
        </p>
      </div>

      {cards.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nothing here yet — your first note will show up as a card.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => setActiveCard(card)}
                className="flex aspect-[4/5] flex-col rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-[box-shadow,transform] duration-200 hover:-translate-y-[1px] hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring"
              >
                <div className="relative min-h-0 flex-1 overflow-hidden">
                  <p className="line-clamp-6 text-sm leading-relaxed text-card-foreground sm:line-clamp-8">
                    {card.content}
                  </p>
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-card to-transparent"
                  />
                </div>
                <p className="pt-4 text-xs text-muted-foreground">
                  {formatRelativeTime(card.created_at)}
                </p>
              </button>
            ))}
          </div>

          <Dialog
            open={activeCard !== null}
            onOpenChange={(open) => {
              if (!open) setActiveCard(null);
            }}
          >
            <DialogContent className="sm:max-w-lg">
              {activeCard && (
                <>
                  <DialogHeader>
                    <DialogTitle className="sr-only">Note</DialogTitle>
                    <DialogDescription>
                      {formatRelativeTime(activeCard.created_at)}
                    </DialogDescription>
                  </DialogHeader>
                  <p className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-popover-foreground">
                    {activeCard.content}
                  </p>
                </>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
