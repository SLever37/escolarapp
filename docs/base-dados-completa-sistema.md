# Base de dados completa do sistema (implementada no `supabase/schema.sql`)

Este documento referencia a expansão completa aplicada no schema com os blocos:
- Núcleo acadêmico (turmas, disciplinas, matrículas, diário, frequência, notas)
- Grade avançada (publicações ativas, regras, recorrências, preferências, calendário, processamentos)
- Operações (portaria, portal da família, estoque, patrimônio, biblioteca)
- RPC transacional para grade (`salvar_grade_horario_atomico`)
- RLS habilitada para tabelas novas e policies de leitura/escrita para ambiente autenticado.

## Observação
- O arquivo `supabase/schema.sql` agora contém toda a estrutura necessária de tabelas para os módulos já presentes no app.
- A política atual mantém perfil de desenvolvimento (authenticated read/write). Em produção, recomenda-se endurecer policies por papel.
