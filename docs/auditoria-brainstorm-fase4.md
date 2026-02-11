# Auditoria inicial (BRAINSTORM x estado do repositório)

## Estrutura principal
- Frontend React/Vite no root (`App.tsx`, `pages`, `componentes`, `components`, `src`).
- Backend modelado em Supabase SQL (`supabase/schema.sql`).
- Testes locais de regras em `tests/grade-rules-check.mjs`.

## Autenticação e identificação do usuário
- Sessão via Supabase Auth (token em storage local) e perfil carregado de `public.usuarios` por `auth_user_id`.
- Delegações carregadas de `public.delegacoes`.

## Páginas existentes
- Painéis por perfil (master, gestor, supervisão, secretaria, professor, família, portaria).
- Módulos centrais (pedagogia, secretaria, diário, portal família, portaria, grade de horários).

## Papéis e níveis já existentes
- `admin_plataforma`, `gestor`, `pedagogia`, `secretaria`, `professor`, `familia`, `portaria`, `servicos_gerais`.
- Níveis N0..N6 já mapeados no front e no banco.

## Lacunas identificadas (antes desta implementação)
- Rotas canônicas do BRAINSTORM não estavam padronizadas em `/master`, `/gestao`, `/supervisao`, etc.
- Guard de rota sem checagem de módulo/delegação (somente papel).
- Regras de PCD para secretaria com delegação explícita não estavam explícitas.
- Schema sem helper functions de autorização por papel/unidade.
- Policies de grade não estavam restritas especificamente a gestor/pedagogia em escrita.
