"use client";

import { useState } from "react";
import { Sidebar, type Tab } from "@/components/sidebar";
import { WriteView } from "@/components/write-view";
import { CardLibrary } from "@/components/card-library";
import { ConnectView } from "@/components/connect-view";
import { ConceptsView } from "@/components/concepts-view";
import type { Card, ConnectionWithCards } from "@/lib/types";

export function Shell({
  cards,
  connections,
}: {
  cards: Card[];
  connections: ConnectionWithCards[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("write");

  return (
    <div className="flex h-screen flex-col overflow-hidden md:flex-row">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-12">
        {activeTab === "write" && <WriteView />}
        {activeTab === "library" && (
          <div className="mx-auto max-w-5xl">
            <CardLibrary cards={cards} />
          </div>
        )}
        {activeTab === "connect" && (
          <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
            <ConnectView cards={cards} />
          </div>
        )}
        {activeTab === "concepts" && (
          <div className="mx-auto max-w-4xl">
            <ConceptsView connections={connections} />
          </div>
        )}
      </main>
    </div>
  );
}
