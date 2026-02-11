-- EscolarApp | Schema inicial para Supabase (PostgreSQL)
-- Execute no SQL Editor do Supabase.

-- Extensões úteis
create extension if not exists "uuid-ossp";

-- =====================================================
-- PERFIS E NÍVEIS (N0..N6)
-- =====================================================
create type public.papel_usuario as enum (
  'admin_plataforma',
  'gestor',
  'pedagogia',
  'secretaria',
  'professor',
  'familia',
  'portaria',
  'servicos_gerais'
);

create table if not exists public.unidades_escolares (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  codigo_inep text,
  ativa boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.usuarios (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid unique, -- pode referenciar auth.users(id)
  nome text not null,
  email text not null unique,
  cpf text,
  papel public.papel_usuario not null,
  nivel smallint not null check (nivel between 0 and 6),
  unidade_id uuid references public.unidades_escolares(id),
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.modulos (
  id text primary key,
  nome text not null,
  descricao text
);

insert into public.modulos (id, nome, descricao)
values
  ('painel_estrategico','Painel Estratégico','Visão gerencial da unidade'),
  ('secretaria_legal','Secretaria Legal','Matrículas, documentos e histórico'),
  ('pedagogia_central','Pedagogia Central','Supervisão pedagógica'),
  ('grade_horarios','Grade de Horários','Planejamento de horários'),
  ('diario_classe','Diário de Classe','Frequência e notas'),
  ('portal_familia','Portal da Família','Acesso familiar e solicitações'),
  ('portaria_acesso','Portaria e Acesso','Controle de entradas e saídas'),
  ('estoque_geral','Estoque Geral','Controle de estoque institucional'),
  ('estoque_cozinha','Estoque da Cozinha','Controle da merenda'),
  ('patrimonio','Patrimônio','Inventário e patrimônio'),
  ('biblioteca','Biblioteca','Gestão de acervo'),
  ('auditoria_forense','Auditoria Forense','Trilha de auditoria'),
  ('backup_institucional','Backup Institucional','Rotinas de cópia de segurança')
on conflict (id) do nothing;

create type public.acao_permissao as enum ('ver','criar','editar','excluir','imprimir','exportar');

create table if not exists public.delegacoes (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  modulo_id text not null references public.modulos(id),
  acoes public.acao_permissao[] not null,
  data_inicio timestamptz,
  data_fim timestamptz,
  criado_por uuid references public.usuarios(id),
  created_at timestamptz not null default now()
);

create table if not exists public.logs_auditoria (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references public.usuarios(id),
  acao text not null,
  modulo_id text references public.modulos(id),
  contexto text,
  metadata jsonb,
  created_at timestamptz not null default now()
);



create table if not exists public.grade_horarios (
  id uuid primary key default uuid_generate_v4(),
  unidade_id uuid not null references public.unidades_escolares(id),
  turma text not null,
  semana_ref text not null,
  versao integer not null default 1,
  status text not null default 'rascunho',
  created_at timestamptz not null default now(),
  criado_por uuid references public.usuarios(id)
);

create table if not exists public.grade_horarios_itens (
  id uuid primary key default uuid_generate_v4(),
  grade_id uuid not null references public.grade_horarios(id) on delete cascade,
  dia_semana text not null,
  horario_inicio text not null,
  horario_fim text not null,
  disciplina text not null,
  professor_id text not null,
  sala text not null
);

create table if not exists public.alunos (
  id uuid primary key default uuid_generate_v4(),
  unidade_id uuid not null references public.unidades_escolares(id),
  nome text not null,
  cpf text,
  turma text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);



create table if not exists public.permissoes_pcd (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  pode_ver_pcd boolean not null default false,
  motivo text,
  created_at timestamptz not null default now()
);

create table if not exists public.alunos_pcd (
  aluno_id uuid primary key references public.alunos(id) on delete cascade,
  pcd boolean not null default false,
  tipos text[] default '{}',
  laudo text,
  adaptacoes text[] default '{}',
  updated_at timestamptz not null default now()
);

-- =====================================================
-- ACESSO MASTER ENRAIZADO
-- email: socrates.lever@gmail.com | senha: 123456
-- IMPORTANTE: a senha deve ser criada no Supabase Auth (Dashboard/Auth).
-- Aqui registramos o perfil de aplicação após criar o usuário em auth.users.
-- =====================================================
insert into public.usuarios (nome, email, cpf, papel, nivel, ativo)
values (
  'Sócrates Lever',
  'socrates.lever@gmail.com',
  null,
  'admin_plataforma',
  0,
  true
)
on conflict (email) do update
set nome = excluded.nome,
    papel = excluded.papel,
    nivel = excluded.nivel,
    ativo = true,
    updated_at = now();

-- =====================================================
-- Trigger para updated_at
-- =====================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_unidades_updated_at on public.unidades_escolares;
create trigger trg_unidades_updated_at before update on public.unidades_escolares
for each row execute function public.set_updated_at();

drop trigger if exists trg_usuarios_updated_at on public.usuarios;
create trigger trg_usuarios_updated_at before update on public.usuarios
for each row execute function public.set_updated_at();

drop trigger if exists trg_alunos_updated_at on public.alunos;
create trigger trg_alunos_updated_at before update on public.alunos
for each row execute function public.set_updated_at();

-- =====================================================
-- RLS base (ajuste conforme auth real do projeto)
-- =====================================================
alter table public.unidades_escolares enable row level security;
alter table public.usuarios enable row level security;
alter table public.delegacoes enable row level security;
alter table public.logs_auditoria enable row level security;
alter table public.alunos enable row level security;
alter table public.alunos_pcd enable row level security;
alter table public.permissoes_pcd enable row level security;
alter table public.grade_horarios enable row level security;
alter table public.grade_horarios_itens enable row level security;

-- Políticas mínimas para desenvolvimento (apenas usuários autenticados)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'unidades_escolares' and policyname = 'auth_read_unidades'
  ) then
    create policy "auth_read_unidades" on public.unidades_escolares for select to authenticated using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'usuarios' and policyname = 'auth_read_usuarios'
  ) then
    create policy "auth_read_usuarios" on public.usuarios for select to authenticated using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'delegacoes' and policyname = 'auth_read_delegacoes'
  ) then
    create policy "auth_read_delegacoes" on public.delegacoes for select to authenticated using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'logs_auditoria' and policyname = 'auth_read_logs'
  ) then
    create policy "auth_read_logs" on public.logs_auditoria for select to authenticated using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'alunos' and policyname = 'auth_read_alunos'
  ) then
    create policy "auth_read_alunos" on public.alunos for select to authenticated using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'alunos_pcd' and policyname = 'auth_read_alunos_pcd'
  ) then
    create policy "auth_read_alunos_pcd" on public.alunos_pcd for select to authenticated using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'permissoes_pcd' and policyname = 'auth_read_permissoes_pcd'
  ) then
    create policy "auth_read_permissoes_pcd" on public.permissoes_pcd for select to authenticated using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'grade_horarios' and policyname = 'auth_read_grade_horarios'
  ) then
    create policy "auth_read_grade_horarios" on public.grade_horarios for select to authenticated using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'grade_horarios_itens' and policyname = 'auth_read_grade_horarios_itens'
  ) then
    create policy "auth_read_grade_horarios_itens" on public.grade_horarios_itens for select to authenticated using (true);
  end if;
end
$$;

-- =====================================================
-- EXPANSÃO COMPLETA DA BASE (núcleo escolar + operações)
-- =====================================================

create type if not exists public.turno_escolar as enum ('manha', 'tarde', 'noite', 'integral');
create type if not exists public.status_matricula as enum ('pre_matricula', 'matriculado', 'transferido', 'concluido', 'cancelado');
create type if not exists public.status_solicitacao as enum ('aberta', 'em_analise', 'deferida', 'indeferida', 'concluida');
create type if not exists public.status_emprestimo as enum ('emprestado', 'devolvido', 'atrasado');
create type if not exists public.status_item_patrimonio as enum ('ativo', 'manutencao', 'baixado');
create type if not exists public.tipo_movimento_estoque as enum ('entrada', 'saida', 'ajuste');

create table if not exists public.turmas (
  id uuid primary key default uuid_generate_v4(),
  unidade_id uuid not null references public.unidades_escolares(id) on delete cascade,
  nome text not null,
  ano_letivo integer not null,
  segmento text,
  turno public.turno_escolar not null default 'manha',
  sala_referencia text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (unidade_id, nome, ano_letivo)
);

create table if not exists public.disciplinas (
  id uuid primary key default uuid_generate_v4(),
  unidade_id uuid not null references public.unidades_escolares(id) on delete cascade,
  nome text not null,
  codigo text,
  carga_horaria_semanal integer,
  ativa boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (unidade_id, nome)
);

create table if not exists public.matriculas (
  id uuid primary key default uuid_generate_v4(),
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  turma_id uuid not null references public.turmas(id) on delete restrict,
  ano_letivo integer not null,
  numero_matricula text,
  status public.status_matricula not null default 'matriculado',
  responsavel_financeiro_id uuid references public.usuarios(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (aluno_id, turma_id, ano_letivo)
);

create table if not exists public.turma_professores (
  id uuid primary key default uuid_generate_v4(),
  turma_id uuid not null references public.turmas(id) on delete cascade,
  professor_id uuid not null references public.usuarios(id) on delete cascade,
  disciplina_id uuid references public.disciplinas(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (turma_id, professor_id, disciplina_id)
);

create table if not exists public.diarios_classe (
  id uuid primary key default uuid_generate_v4(),
  turma_id uuid not null references public.turmas(id) on delete cascade,
  disciplina_id uuid not null references public.disciplinas(id) on delete cascade,
  professor_id uuid not null references public.usuarios(id) on delete cascade,
  ano_letivo integer not null,
  periodo text not null,
  created_at timestamptz not null default now(),
  unique (turma_id, disciplina_id, professor_id, ano_letivo, periodo)
);

create table if not exists public.diario_aulas (
  id uuid primary key default uuid_generate_v4(),
  diario_id uuid not null references public.diarios_classe(id) on delete cascade,
  data_aula date not null,
  conteudo text,
  observacoes text,
  created_at timestamptz not null default now(),
  unique (diario_id, data_aula)
);

create table if not exists public.diario_frequencias (
  id uuid primary key default uuid_generate_v4(),
  aula_id uuid not null references public.diario_aulas(id) on delete cascade,
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  presente boolean not null,
  justificativa text,
  created_at timestamptz not null default now(),
  unique (aula_id, aluno_id)
);

create table if not exists public.diario_avaliacoes (
  id uuid primary key default uuid_generate_v4(),
  diario_id uuid not null references public.diarios_classe(id) on delete cascade,
  titulo text not null,
  peso numeric(5,2) not null default 1,
  data_avaliacao date,
  created_at timestamptz not null default now()
);

create table if not exists public.diario_notas (
  id uuid primary key default uuid_generate_v4(),
  avaliacao_id uuid not null references public.diario_avaliacoes(id) on delete cascade,
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  nota numeric(5,2) not null,
  created_at timestamptz not null default now(),
  unique (avaliacao_id, aluno_id)
);

create table if not exists public.grade_horarios_publicacoes (
  id uuid primary key default uuid_generate_v4(),
  unidade_id uuid not null references public.unidades_escolares(id) on delete cascade,
  turma text not null,
  grade_id uuid not null references public.grade_horarios(id) on delete cascade,
  publicado_por uuid references public.usuarios(id),
  publicado_em timestamptz not null default now(),
  ativo boolean not null default true
);
create unique index if not exists idx_grade_publicacao_ativa on public.grade_horarios_publicacoes(unidade_id, turma) where ativo = true;

create table if not exists public.grade_regras_config (
  id uuid primary key default uuid_generate_v4(),
  unidade_id uuid not null references public.unidades_escolares(id) on delete cascade,
  turma text,
  carga_max_professor_dia integer not null default 6,
  max_janelas_professor_dia integer not null default 2,
  max_janelas_turma_dia integer not null default 2,
  max_aulas_consecutivas_professor integer not null default 4,
  permitir_sobreposicao_turma boolean not null default false,
  distribuicao_turno_min_manha integer not null default 0,
  distribuicao_turno_min_tarde integer not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.grade_regras_limites_professor (
  id uuid primary key default uuid_generate_v4(),
  regra_config_id uuid not null references public.grade_regras_config(id) on delete cascade,
  professor_id text not null,
  maximo_aulas_semana integer not null
);

create table if not exists public.grade_regras_limites_disciplina (
  id uuid primary key default uuid_generate_v4(),
  regra_config_id uuid not null references public.grade_regras_config(id) on delete cascade,
  disciplina text not null,
  maximo_aulas_semana integer not null
);

create table if not exists public.grade_restricoes_recorrentes (
  id uuid primary key default uuid_generate_v4(),
  regra_config_id uuid not null references public.grade_regras_config(id) on delete cascade,
  recurso_tipo text not null check (recurso_tipo in ('professor','sala')),
  recurso_id text not null,
  dia_semana text not null,
  horario_inicio text not null,
  horario_fim text not null,
  recorrente boolean not null default true
);

create table if not exists public.grade_restricoes_recorrentes_excecoes (
  id uuid primary key default uuid_generate_v4(),
  restricao_id uuid not null references public.grade_restricoes_recorrentes(id) on delete cascade,
  semana_ref text not null,
  unique (restricao_id, semana_ref)
);

create table if not exists public.grade_preferencias_soft_professor (
  id uuid primary key default uuid_generate_v4(),
  regra_config_id uuid not null references public.grade_regras_config(id) on delete cascade,
  professor_id text not null,
  turno_preferido text not null check (turno_preferido in ('manha','tarde')),
  peso integer not null default 1
);

create table if not exists public.calendario_letivo (
  id uuid primary key default uuid_generate_v4(),
  unidade_id uuid not null references public.unidades_escolares(id) on delete cascade,
  data date not null,
  semana_ref text not null,
  tipo text not null check (tipo in ('letivo','feriado','recesso','evento')),
  descricao text,
  unique (unidade_id, data)
);

create table if not exists public.grade_processamentos (
  id uuid primary key default uuid_generate_v4(),
  unidade_id uuid not null references public.unidades_escolares(id) on delete cascade,
  turma text not null,
  status text not null check (status in ('pendente','executando','concluido','erro')),
  resultado jsonb,
  iniciado_em timestamptz not null default now(),
  finalizado_em timestamptz
);

create table if not exists public.portaria_acessos (
  id uuid primary key default uuid_generate_v4(),
  unidade_id uuid not null references public.unidades_escolares(id) on delete cascade,
  pessoa_tipo text not null check (pessoa_tipo in ('aluno','usuario','visitante')),
  aluno_id uuid references public.alunos(id),
  usuario_id uuid references public.usuarios(id),
  nome_visitante text,
  documento_visitante text,
  tipo_movimento text not null check (tipo_movimento in ('entrada','saida')),
  horario timestamptz not null default now(),
  registrado_por uuid references public.usuarios(id),
  observacao text
);

create table if not exists public.portal_familia_vinculos (
  id uuid primary key default uuid_generate_v4(),
  responsavel_usuario_id uuid not null references public.usuarios(id) on delete cascade,
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  grau_parentesco text,
  created_at timestamptz not null default now(),
  unique (responsavel_usuario_id, aluno_id)
);

create table if not exists public.portal_familia_solicitacoes (
  id uuid primary key default uuid_generate_v4(),
  unidade_id uuid not null references public.unidades_escolares(id) on delete cascade,
  solicitante_usuario_id uuid not null references public.usuarios(id) on delete cascade,
  aluno_id uuid references public.alunos(id),
  tipo text not null,
  descricao text,
  status public.status_solicitacao not null default 'aberta',
  resposta text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.estoque_locais (
  id uuid primary key default uuid_generate_v4(),
  unidade_id uuid not null references public.unidades_escolares(id) on delete cascade,
  nome text not null,
  tipo text not null check (tipo in ('geral','cozinha','limpeza','laboratorio','outro')),
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  unique (unidade_id, nome)
);

create table if not exists public.estoque_itens (
  id uuid primary key default uuid_generate_v4(),
  unidade_id uuid not null references public.unidades_escolares(id) on delete cascade,
  local_id uuid not null references public.estoque_locais(id) on delete cascade,
  nome text not null,
  categoria text,
  unidade_medida text,
  quantidade_atual numeric(12,3) not null default 0,
  estoque_minimo numeric(12,3) not null default 0,
  validade date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.estoque_movimentos (
  id uuid primary key default uuid_generate_v4(),
  item_id uuid not null references public.estoque_itens(id) on delete cascade,
  tipo public.tipo_movimento_estoque not null,
  quantidade numeric(12,3) not null,
  motivo text,
  registrado_por uuid references public.usuarios(id),
  created_at timestamptz not null default now()
);

create table if not exists public.patrimonio_itens (
  id uuid primary key default uuid_generate_v4(),
  unidade_id uuid not null references public.unidades_escolares(id) on delete cascade,
  codigo_tombamento text not null,
  descricao text not null,
  localizacao text,
  status public.status_item_patrimonio not null default 'ativo',
  valor_aquisicao numeric(12,2),
  data_aquisicao date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (unidade_id, codigo_tombamento)
);

create table if not exists public.patrimonio_movimentos (
  id uuid primary key default uuid_generate_v4(),
  patrimonio_item_id uuid not null references public.patrimonio_itens(id) on delete cascade,
  tipo text not null check (tipo in ('entrada','transferencia','manutencao','baixa')),
  local_origem text,
  local_destino text,
  descricao text,
  registrado_por uuid references public.usuarios(id),
  created_at timestamptz not null default now()
);

create table if not exists public.biblioteca_acervo (
  id uuid primary key default uuid_generate_v4(),
  unidade_id uuid not null references public.unidades_escolares(id) on delete cascade,
  titulo text not null,
  autor text,
  isbn text,
  categoria text,
  quantidade_total integer not null default 1,
  quantidade_disponivel integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.biblioteca_emprestimos (
  id uuid primary key default uuid_generate_v4(),
  acervo_id uuid not null references public.biblioteca_acervo(id) on delete cascade,
  aluno_id uuid references public.alunos(id),
  usuario_id uuid references public.usuarios(id),
  data_emprestimo date not null default current_date,
  data_prevista_devolucao date,
  data_devolucao date,
  status public.status_emprestimo not null default 'emprestado',
  registrado_por uuid references public.usuarios(id),
  created_at timestamptz not null default now()
);

-- Trigger updated_at em novas tabelas
do $$
declare
  table_name text;
begin
  for table_name in
    select unnest(array[
      'turmas','disciplinas','matriculas','grade_regras_config','portal_familia_solicitacoes',
      'estoque_itens','patrimonio_itens','biblioteca_acervo'
    ])
  loop
    execute format('drop trigger if exists trg_%s_updated_at on public.%s;', table_name, table_name);
    execute format('create trigger trg_%s_updated_at before update on public.%s for each row execute function public.set_updated_at();', table_name, table_name);
  end loop;
end
$$;

-- Função RPC para salvar grade em transação atômica
create or replace function public.salvar_grade_horario_atomico(
  p_unidade_id uuid,
  p_turma text,
  p_semana_ref text,
  p_status text,
  p_criado_por uuid,
  p_itens jsonb
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_grade_id uuid;
  v_versao integer;
  v_item jsonb;
begin
  select coalesce(max(versao), 0) + 1
  into v_versao
  from public.grade_horarios
  where unidade_id = p_unidade_id and turma = p_turma;

  insert into public.grade_horarios(unidade_id, turma, semana_ref, versao, status, criado_por)
  values (p_unidade_id, p_turma, p_semana_ref, v_versao, coalesce(p_status, 'rascunho'), p_criado_por)
  returning id into v_grade_id;

  if p_itens is not null then
    for v_item in select * from jsonb_array_elements(p_itens)
    loop
      insert into public.grade_horarios_itens(
        grade_id, dia_semana, horario_inicio, horario_fim, disciplina, professor_id, sala
      )
      values (
        v_grade_id,
        coalesce(v_item->>'dia_semana', ''),
        coalesce(v_item->>'horario_inicio', ''),
        coalesce(v_item->>'horario_fim', ''),
        coalesce(v_item->>'disciplina', ''),
        coalesce(v_item->>'professor_id', ''),
        coalesce(v_item->>'sala', '')
      );
    end loop;
  end if;

  return jsonb_build_object('grade_id', v_grade_id, 'versao', v_versao, 'status', coalesce(p_status, 'rascunho'));
end;
$$;

grant execute on function public.salvar_grade_horario_atomico(uuid, text, text, text, uuid, jsonb) to authenticated;

-- RLS para novas tabelas
do $$
begin
  alter table public.turmas enable row level security;
  alter table public.disciplinas enable row level security;
  alter table public.matriculas enable row level security;
  alter table public.turma_professores enable row level security;
  alter table public.diarios_classe enable row level security;
  alter table public.diario_aulas enable row level security;
  alter table public.diario_frequencias enable row level security;
  alter table public.diario_avaliacoes enable row level security;
  alter table public.diario_notas enable row level security;
  alter table public.grade_horarios_publicacoes enable row level security;
  alter table public.grade_regras_config enable row level security;
  alter table public.grade_regras_limites_professor enable row level security;
  alter table public.grade_regras_limites_disciplina enable row level security;
  alter table public.grade_restricoes_recorrentes enable row level security;
  alter table public.grade_restricoes_recorrentes_excecoes enable row level security;
  alter table public.grade_preferencias_soft_professor enable row level security;
  alter table public.calendario_letivo enable row level security;
  alter table public.grade_processamentos enable row level security;
  alter table public.portaria_acessos enable row level security;
  alter table public.portal_familia_vinculos enable row level security;
  alter table public.portal_familia_solicitacoes enable row level security;
  alter table public.estoque_locais enable row level security;
  alter table public.estoque_itens enable row level security;
  alter table public.estoque_movimentos enable row level security;
  alter table public.patrimonio_itens enable row level security;
  alter table public.patrimonio_movimentos enable row level security;
  alter table public.biblioteca_acervo enable row level security;
  alter table public.biblioteca_emprestimos enable row level security;
exception when others then
  null;
end
$$;

do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'turmas','disciplinas','matriculas','turma_professores','diarios_classe','diario_aulas','diario_frequencias',
      'diario_avaliacoes','diario_notas','grade_horarios_publicacoes','grade_regras_config','grade_regras_limites_professor',
      'grade_regras_limites_disciplina','grade_restricoes_recorrentes','grade_restricoes_recorrentes_excecoes',
      'grade_preferencias_soft_professor','calendario_letivo','grade_processamentos','portaria_acessos',
      'portal_familia_vinculos','portal_familia_solicitacoes','estoque_locais','estoque_itens','estoque_movimentos',
      'patrimonio_itens','patrimonio_movimentos','biblioteca_acervo','biblioteca_emprestimos'
    ])
  loop
    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = t and policyname = 'auth_read_' || t
    ) then
      execute format('create policy %I on public.%I for select to authenticated using (true);', 'auth_read_' || t, t);
    end if;

    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = t and policyname = 'auth_write_' || t
    ) then
      execute format('create policy %I on public.%I for all to authenticated using (true) with check (true);', 'auth_write_' || t, t);
    end if;
  end loop;
end
$$;
