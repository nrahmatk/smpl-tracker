import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Product = {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
  keywords: string | null;
  line_number: number;
  rack_number: number;
  section: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
};
