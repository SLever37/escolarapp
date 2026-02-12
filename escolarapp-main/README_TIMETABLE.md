
# 🗓️ Módulo Timetable (Nível ASC)

O motor de horários do EscolarApp foi projetado para lidar com a complexidade real de uma escola, onde o horário não é apenas uma distribuição de aulas, mas uma ferramenta de otimização de recursos.

## 🛠️ Filosofia de Design
- **Prioridade Humana**: Evita "janelas" (horários vagos entre aulas) para professores.
- **Rigor Pedagógico**: Favorece aulas duplas para disciplinas de exatas e laboratoriais.
- **Conformidade de Rede**: Garante que o mesmo professor não seja alocado em duas unidades da rede simultaneamente.

## 🧱 Regras Implementadas (Placeholder Concept)
1. **Unicidade de Professor**: Um professor não pode estar em dois slots no mesmo horário.
2. **Distribuição Semanal**: Disciplinas com 2h semanais não devem ocorrer no mesmo dia.
3. **Restrição de Salas**: Turmas com a mesma necessidade de laboratório são gerenciadas por fila de prioridade.

## 🚀 Evolução Futura
Integração com o módulo de Substituição Automática: quando um professor registra falta no RH, o sistema sugere a reorganização da grade baseada na disponibilidade em tempo real dos outros docentes.
