Guia de Migração e Governança (Português - Brasil)

Objetivo
-------
Consolidar controle de acesso institucional com hierarquia clara, delegações e matriz de permissões.

O que já foi feito
------------------
- Adicionados SQLs: `supabase_schema.sql`, `supabase_seed.sql`, `supabase_matriz_permissoes.sql`, `supabase_rpc_contracts.sql`.
- Implementado `AuthContext` e integração com Supabase.
- Implementado `servicos/permissoesService.ts` (em português).
- Adicionado `components/GuardiaoPermissao.tsx` e `servicos/contractsService.ts`.

Próximos passos recomendados
---------------------------
1) Executar `supabase_matriz_permissoes.sql` no SQL Editor do Supabase (já criado). Ele cria tabelas de `papeis`, `papeis_permissoes`, `delegacoes`, `delegacoes_log`.
2) Popular `papeis_permissoes` conforme a necessidade institucional (módulos e ações). Isso define a matriz estática.
3) Usar `delegacoes` para conceder permissões específicas a usuários individuais (ex.: merendeira -> estoque_cozinha).
4) Revisar políticas RLS no Supabase para garantir que usuários só leiam/escrevam rows do seu escopo.
5) Migrar menus para chamarem `servicos/permissoesService.podeAcessar` (atual `NavegacaoLateral` já usa `temPermissao`).
6) Testar fluxos com contas reais criadas em Auth do Supabase.

Observações de governança
------------------------
- O `gestor` foi configurado como o único perfil com visão completa (nível 1). O `admin_plataforma` (nível 0) tem poder administrativo da plataforma.
- Delegações são registradas em `delegacoes_log` para auditoria.
- Recomenda-se ativar RLS e criar policies finas por tabela (ex.: `contratos` só visíveis por `profile_id` ou por gestores).
