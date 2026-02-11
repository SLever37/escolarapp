# Status de Finalização — Fase 4 (Grade de Horários)

## Estado atual
- **Status geral:** Em estágio avançado, pronto para homologação funcional.
- **Cobertura atual:**
  - editor de grade com validações hard/soft
  - histórico e versionamento
  - publicação e definição de versão ativa em nível de app
  - fallback de persistência quando RPC atômica não está disponível
  - checks automatizados locais (`test:grade-rules` + `build`)

## O que ainda falta para considerar "produção final"
1. **Ativação oficial no backend**
   - versão ativa ainda em storage local do app; formalizar em tabela/backend.
2. **RPC atômica efetiva no Supabase**
   - endpoint já previsto no código, mas depende de disponibilização SQL no ambiente.
3. **Observabilidade**
   - métricas/log estruturado para falhas de validação e fallback.
4. **Governança de publicação**
   - fluxo de aprovação/reversão por perfil com trilha de auditoria dedicada.
5. **E2E de regressão**
   - cenários automatizados de publicação/ativação/consumo por outros módulos.

## Critérios de aceite sugeridos para "finalizado"
- RPC `salvar_grade_horario_atomico` ativo no ambiente e validado.
- versão ativa persistida no backend e consumida por módulos dependentes.
- suíte de regressão executada em CI (regras + build + smoke e2e).
- checklist de rollback e monitoramento publicado.

## Comando de validação rápida
- `npm run check:ready`
