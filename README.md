# 🧠 EscolarApp — Central de Governança Escolar

Este projeto é um ecossistema digital para gestão educacional com governança por níveis de acesso.

## 🎯 Visão do Sistema
O EscolarApp prioriza conformidade legal, segurança de dados (LGPD) e apoio à decisão.

## 🧭 Hierarquia canônica de perfis (N0..N6)
- **Nível 0 — Acesso Master (Plataforma):** cria escola e gestor.
- **Nível 1 — Gestor/Diretor:** visão total da unidade (único perfil de visão completa).
- **Nível 2 — Supervisão/Pedagogia:** somente módulo pedagógico e grade de horários.
- **Nível 3 — Secretaria:** documentação escolar, histórico, declarações e processos legais.
- **Nível 4 — Professor:** diário de classe, frequência, notas e atividades.
- **Nível 5 — Família:** consulta da vida escolar via acesso mock por CPF.
- **Nível 6 — Vigia/Portaria:** controle de entrada e saída, ocorrências e presença do dia.

## 🛣️ Rotas principais de painéis por perfil
- `/painel/master`
- `/painel/gestor`
- `/painel/supervisao`
- `/painel/secretaria`
- `/painel/professor`
- `/painel/familia`
- `/painel/portaria`

As rotas usam guardião de perfil. Se o usuário tentar acessar rota proibida, ele é redirecionado para o painel do próprio perfil.

## 🔐 Gestão de acessos e delegação
Tela do gestor em `/gestao-acessos` com:
- criação de usuário mock,
- definição de cargo base,
- aplicação de presets de delegação,
- logs mock de delegação.

Presets oficiais:
- **Merendeira:** Estoque da Cozinha
- **Vigia:** Portaria + Patrimônio e Inventário
- **Bibliotecário:** Biblioteca

## 🧪 Como testar perfis em modo mock
Na tela de login (`/`), use prefixos no campo de usuário/e-mail:
- `master@...`
- `gestor@...`
- `ped@...`
- `sec@...`
- `prof@...`
- `cpf@...` ou `familia@...`
- `vigia@...` ou `port@...`

## 📂 Organização principal
- `/src/utils`: camada canônica de perfis, permissões, delegações e menu por perfil.
- `/components/roteamento`: guardião de rota por perfil.
- `/pages/paineis`: páginas iniciais por perfil, reaproveitando módulos existentes.
- `/pages/gestor/GestaoAcessos.tsx`: gestão de acessos e delegações.

## 🚀 Comandos
```bash
npm install
npm run dev
npm run build
```

## 🧱 Supabase (tabelas iniciais)
Foi adicionado o arquivo `supabase/schema.sql` com as tabelas principais:
- `unidades_escolares`
- `usuarios`
- `modulos`
- `delegacoes`
- `logs_auditoria`
- `alunos`
- `alunos_pcd`

Também inclui seed do master de aplicação:
- e-mail: `socrates.lever@gmail.com`
- papel: `admin_plataforma` (nível 0)

> A senha (`123456`) deve ser criada no **Supabase Auth** (Dashboard), pois não é armazenada na tabela `usuarios`.


### Conexão do app com banco (Supabase)
A tela **Gestão de Acessos** agora tenta ler/gravar no banco via API REST do Supabase quando as variáveis abaixo estão configuradas:

```bash
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
# ou
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLISHABLE
```

Sem essas variáveis, o app entra automaticamente em **modo local (mock)** e mostra esse status na interface.

> Dica: no arquivo `.env.local`, use sem espaços: `VITE_SUPABASE_URL=https://...` (evite `VITE_SUPABASE_URL = https://...`).


## 🌐 Cloudflare Pages: branches no domínio do projeto
Para que as branches publiquem dentro do domínio do projeto `escolarapp.pages.dev`, configure no Cloudflare:

1. **Project name**: `escolarapp` (isso define o domínio base `escolarapp.pages.dev`).
2. **Production branch**: escolha a branch principal (ex.: `main` ou `work`).
3. **Preview deployments**: habilitado para branches.

Com isso, os previews ficam no padrão:
- Produção: `https://escolarapp.pages.dev`
- Branch: `https://<nome-da-branch>.escolarapp.pages.dev`

> Observação: não é possível forçar todas as branches para a **mesma URL exata** `https://escolarapp.pages.dev` sem sobrescrever o ambiente de produção. O padrão correto do Cloudflare Pages para branches é subdomínio por branch.


⚠️ Nunca comite chaves reais no repositório. Use `.env.local` no ambiente local e variáveis de ambiente no Cloudflare Pages.

## 🔐 Autenticação e sessão (Supabase)
- O login usa autenticação real via Supabase Auth (`signInWithPassword` no endpoint Auth).
- A sessão é persistida no navegador e reutilizada ao recarregar a página.
- O perfil institucional é carregado da tabela `public.usuarios` pelo campo `auth_user_id`.
- As delegações do usuário são carregadas da tabela `public.delegacoes`.
- Em ambiente DEV, sem Supabase configurado, o sistema mantém modo mock para testes de perfil.

### Vincular usuário Auth ao perfil institucional
1. Crie o usuário no Supabase Auth.
2. Pegue o `id` do usuário em `auth.users`.
3. No `public.usuarios`, preencha `auth_user_id` com esse mesmo `id`.
4. Defina `papel`, `nivel` e `unidade_id`.


## 🛡️ Fase 2 — Gestão de Acessos real (Supabase)
- A página **Gestão de Acessos** agora permite delegação por **módulo + ação**:
  - ações: ver, criar, editar, excluir, imprimir, exportar.
- Presets disponíveis:
  - Merendeira (Estoque da Cozinha)
  - Vigia (Portaria + Patrimônio)
  - Bibliotecário (Biblioteca)
  - Almoxarife (Estoque Geral)
- Ao salvar delegações, o sistema persiste em `public.delegacoes` e grava auditoria em `public.logs_auditoria` com `antes/depois`.
