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
```

Sem essas variáveis, o app entra automaticamente em **modo local (mock)** e mostra esse status na interface.
