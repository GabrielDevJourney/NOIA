import { supabase } from "@/lib/supabase";
import seedNotes from "@/data/seed.json";

export async function seedIfEmpty() {
  const { count } = await supabase
    .from("cards")
    .select("id", { count: "exact", head: true });

  if (count && count > 0) return;

  await supabase
    .from("cards")
    .insert(seedNotes.map((content) => ({ content })));
}
