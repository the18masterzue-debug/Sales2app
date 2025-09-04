import { createClient } from '@supabase/supabase-js';

// As variáveis de ambiente são injetadas pelo ambiente de hospedagem (ex: Netlify)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL and Anon Key are required. Make sure to set them in your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
