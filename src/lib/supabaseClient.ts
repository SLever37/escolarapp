const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  ''
).trim();

export const supabaseAtivo = Boolean(supabaseUrl && supabaseKey);

const headersBase = {
  apikey: supabaseKey,
  Authorization: `Bearer ${supabaseKey}`,
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
