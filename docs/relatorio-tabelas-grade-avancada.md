# Relatório de tabelas recomendadas (Fase 4 avançada)

> Objetivo: apoiar regras avançadas de timetabling, versão ativa oficial e salvamento transacional via RPC.

## 1) `grade_horarios_publicacoes`
- **Finalidade:** definir explicitamente qual versão publicada está ativa por turma/unidade.
- **Colunas sugeridas:**
  - `id uuid pk`
  - `unidade_id uuid`
  - `turma text`
  - `grade_id uuid` (FK para `grade_horarios.id`)
  - `publicado_por uuid`
  - `publicado_em timestamptz`
  - `ativo boolean default true`
- **Observações:** índice único parcial em (`unidade_id`, `turma`) onde `ativo=true`.

## 2) `grade_regras_config`
- **Finalidade:** guardar configuração da matriz de regras hard/soft por unidade e/ou turma.
- **Colunas sugeridas:**
  - `id uuid pk`
  - `unidade_id uuid`
  - `turma text null`
  - `carga_max_professor_dia int`
  - `max_janelas_professor_dia int`
  - `max_janelas_turma_dia int`
  - `max_aulas_consecutivas_professor int`
  - `permitir_sobreposicao_turma boolean`
  - `distribuicao_turno_min_manha int`
  - `distribuicao_turno_min_tarde int`
  - `ativo boolean`
  - `criado_em/atualizado_em timestamptz`

## 3) `grade_regras_limites_professor`
- **Finalidade:** limites semanais por professor.
- **Colunas sugeridas:**
  - `id uuid pk`
  - `regra_config_id uuid` (FK)
  - `professor_id text`
  - `maximo_aulas_semana int`

## 4) `grade_regras_limites_disciplina`
- **Finalidade:** limites semanais por disciplina.
- **Colunas sugeridas:**
  - `id uuid pk`
  - `regra_config_id uuid` (FK)
  - `disciplina text`
  - `maximo_aulas_semana int`

## 5) `grade_restricoes_recorrentes`
- **Finalidade:** indisponibilidades recorrentes (professor/sala) com exceções por semana.
- **Colunas sugeridas:**
  - `id uuid pk`
  - `regra_config_id uuid` (FK)
  - `recurso_tipo text` (`professor`/`sala`)
  - `recurso_id text`
  - `dia_semana text`
  - `horario_inicio time`
  - `horario_fim time`
  - `recorrente boolean`

## 6) `grade_restricoes_recorrentes_excecoes`
- **Finalidade:** semanas com exceção para uma restrição recorrente.
- **Colunas sugeridas:**
  - `id uuid pk`
  - `restricao_id uuid` (FK)
  - `semana_ref text`

## 7) `grade_preferencias_soft_professor`
- **Finalidade:** preferências não bloqueantes (turno/preferência de distribuição).
- **Colunas sugeridas:**
  - `id uuid pk`
  - `regra_config_id uuid` (FK)
  - `professor_id text`
  - `turno_preferido text` (`manha`/`tarde`)
  - `peso int`

## 8) `calendario_letivo`
- **Finalidade:** base de semanas letivas, feriados e exceções institucionais.
- **Colunas sugeridas:**
  - `id uuid pk`
  - `unidade_id uuid`
  - `data date`
  - `semana_ref text`
  - `tipo text` (`letivo`, `feriado`, `recesso`, `evento`)
  - `descricao text`

## 9) `grade_processamentos`
- **Finalidade:** rastrear execuções de geração/otimização da grade.
- **Colunas sugeridas:**
  - `id uuid pk`
  - `unidade_id uuid`
  - `turma text`
  - `status text` (`pendente`, `executando`, `concluido`, `erro`)
  - `resultado jsonb`
  - `iniciado_em/finalizado_em timestamptz`

## RPC recomendada (sem SQL aqui)
- `rpc/salvar_grade_horario_atomico`
  - Entrada: cabeçalho da grade + array de itens + metadados.
  - Ação: transação única para versão + itens + (opcional) atualização de versão ativa.
  - Saída: `grade_id`, `versao`, `status`, `mensagem`.
