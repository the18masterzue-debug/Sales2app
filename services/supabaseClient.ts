import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;
let errorMessage: string | null = null;

try {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error("Credenciais do Supabase não encontradas nas variáveis de ambiente.");
    }
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

} catch (error) {
    console.error("Erro ao inicializar Supabase:", error);
    errorMessage = "A configuração do Supabase está incompleta. Verifique se as variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY estão definidas e corretas.";
}

export const supabase = supabaseInstance;
export const supabaseError = errorMessage;
