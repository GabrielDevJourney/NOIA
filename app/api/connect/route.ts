import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateConnection } from "@/lib/claude";

export async function POST(req: Request) {
  const { cardId1, cardId2 } = await req.json();

  if (!cardId1 || !cardId2) {
    return NextResponse.json(
      { error: "cardId1 and cardId2 are required" },
      { status: 400 }
    );
  }

  const { data: cards, error: fetchError } = await supabase
    .from("cards")
    .select("id, content")
    .in("id", [cardId1, cardId2]);

  const cardA = cards?.find((c) => c.id === cardId1);
  const cardB = cards?.find((c) => c.id === cardId2);

  if (fetchError || !cardA || !cardB) {
    return NextResponse.json({ error: "cards not found" }, { status: 404 });
  }

  let result;
  try {
    result = await generateConnection(cardA.content, cardB.content);
  } catch {
    return NextResponse.json(
      { error: "generation failed, please try again" },
      { status: 502 }
    );
  }

  const { data: saved, error: insertError } = await supabase
    .from("connections")
    .insert({
      card_id_1: cardId1,
      card_id_2: cardId2,
      concept_name: result.name,
      definition: result.definition,
      no_connection: result.noConnection,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json(saved);
}
