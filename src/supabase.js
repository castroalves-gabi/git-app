import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hmnemukpkizkdjjweuwz.supabase.co";
const supabaseKey = "sb_publishable_Ucz3td0zi1dt8ytK77fgXg_KjrQfW1M";

export const supabase = createClient(supabaseUrl, supabaseKey);
