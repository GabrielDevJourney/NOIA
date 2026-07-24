import { seedIfEmpty } from "@/lib/seed";
import { getCards, getConnectionsWithCards } from "@/lib/queries";
import { Shell } from "@/components/shell";

export const dynamic = "force-dynamic";

export default async function AppPage() {
  await seedIfEmpty();

  const [cards, connections] = await Promise.all([
    getCards(),
    getConnectionsWithCards(),
  ]);

  return <Shell cards={cards} connections={connections} />;
}
