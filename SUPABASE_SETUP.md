Guia rápido para integrar o backend no Supabase e ativar o frontend

Passo a passo resumido:

1) Criar um projeto no Supabase
   - Acesse https://app.supabase.com e crie um novo projeto.
   - Copie o `URL` e `anon` key (chave pública) do projeto.

2) Criar esquema de banco (SQL)
   - No painel do Supabase, abra a seção SQL Editor e execute o conteúdo de `supabase_schema.sql`.

3) Rodar seeds (opcional)
   - Ainda no SQL Editor, execute `supabase_seed.sql` para criar contas de teste.

4) Configurar variáveis no frontend
   - Crie um arquivo `.env` no root do projeto com:

```
VITE_SUPABASE_URL="https://<seu-projeto>.supabase.co"
VITE_SUPABASE_ANON_KEY="<anon-key-aqui>"
```

5) Instalar dependências e executar

```bash
npm install
npm run dev
```

6) Testar login
   - Use as contas de teste executadas no seed (ex.: master@exemplo.test / senha Teste123!).

Arquivos incluídos:
- `servicos/supabaseClient.ts` — cliente supabase usando `VITE_SUPABASE_*`.
- `servicos/supabaseService.ts` — funções `signIn`, `signOut`, `getProfileById`.
- `context/AuthContext.tsx` — provê `useAuth()` para componentes.
- `components/RequireAuth.tsx` — wrapper para proteger rotas.
- Atualizações em `paginas/Login.tsx`, `App.tsx` e `index.tsx` para usar AuthContext.

Se quiser que eu rode os comandos locais (instalar dependências, etc.), diga e eu mostro exatamente o que executar.
