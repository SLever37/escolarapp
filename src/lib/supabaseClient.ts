const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseAtivo = Boolean(supabaseUrl && supabaseAnonKey);

const headersBase = {
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json',
};

export const supabaseRest = {
  async select<T = unknown>(endpoint: string): Promise<T> {
    if (!supabaseAtivo) throw new Error('Supabase não configurado');
    const resposta = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
      headers: headersBase,
    });
    if (!resposta.ok) throw new Error(await resposta.text());
    return resposta.json();
  },

  async insert<T = unknown>(endpoint: string, body: unknown, returning = 'representation'): Promise<T> {
    if (!supabaseAtivo) throw new Error('Supabase não configurado');
    const resposta = await fetch(`${supabaseUrl}/rest/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        ...headersBase,
        Prefer: `return=${returning}`,
      },
      body: JSON.stringify(body),
    });
    if (!resposta.ok) throw new Error(await resposta.text());
    return resposta.json();
  },
};
