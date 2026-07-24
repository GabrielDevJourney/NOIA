export type Card = {
  id: string;
  content: string;
  created_at: string;
};

export type Connection = {
  id: string;
  card_id_1: string;
  card_id_2: string;
  concept_name: string | null;
  definition: string | null;
  no_connection: boolean;
  created_at: string;
};

export type ConnectionWithCards = Connection & {
  card_1: Card | null;
  card_2: Card | null;
};
