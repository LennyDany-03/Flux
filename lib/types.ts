export type Link = {
  id: string;
  code: string;
  destination_url: string;
  title?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
