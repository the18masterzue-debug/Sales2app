import { createClient } from '@supabase/supabase-js';

// As credenciais foram fornecidas pelo usuário e hardcoded para fazer o aplicativo funcionar.
// Em um ambiente de produção, essas chaves devem ser gerenciadas por meio de variáveis de ambiente.
const supabaseUrl = 'https://rgdnrywmhhzvdsqnolwr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZG5yeXdtaGh6dmRzcW5vbHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMjkxNDgsImV4cCI6MjA3MjYwNTE0OH0.cAPxL_60iKYVL126uFc5qxuqYCVgA2r0Depn4ZL__y0';


let supabaseInstance = null;
let errorMessage: string | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
    errorMessage = "As credenciais do Supabase (URL e Chave Anônima) não foram fornecidas no código.";
    console.error(errorMessage);
} else {
    try {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (error) {
        console.error("Erro ao inicializar Supabase:", error);
        errorMessage = `Falha ao criar o cliente Supabase. Verifique as credenciais. Detalhes: ${error.message}`;
    }
}

export const supabase = supabaseInstance;
export const supabaseError = errorMessage;
