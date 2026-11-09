export interface LinkItem {
  id: number;
  title: string;
  url: string;
  description: string | null;
  category: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type LinkPayload = Omit<
  LinkItem,
  "id" | "created_at" | "updated_at"
>;

