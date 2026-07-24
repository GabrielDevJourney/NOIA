import { supabase } from "@/lib/supabase";
import type { Card, ConnectionWithCards } from "@/lib/types";

export async function getCards(): Promise<Card[]> {
  const { data } = await supabase
    .from("cards")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getConnectionsWithCards(): Promise<
  ConnectionWithCards[]
> {
  const { data } = await supabase
    .from("connections")
    .select(
      "*, card_1:cards!connections_card_id_1_fkey(*), card_2:cards!connections_card_id_2_fkey(*)"
    )
    .order("created_at", { ascending: false });
  return (data as ConnectionWithCards[]) ?? [];
}
