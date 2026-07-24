import { ConceptCard } from "@/components/concept-card";
import type { ConnectionWithCards } from "@/lib/types";

export function ConceptsView({ connections }: { connections: ConnectionWithCards[] }) {
  if (connections.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No concepts yet — connect two notes to make one.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,280px))] justify-center gap-6">
      {connections.map((connection) => (
        <ConceptCard connection={connection} key={connection.id} />
      ))}
    </div>
  );
}
