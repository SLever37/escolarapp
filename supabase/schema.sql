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

create table if not exists public.alunos (
  id uuid primary key default uuid_generate_v4(),
  unidade_id uuid not null references public.unidades_escolares(id),
  nome text not null,
  cpf text,
  turma text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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

create trigger trg_unidades_updated_at before update on public.unidades_escolares
for each row execute function public.set_updated_at();

create trigger trg_usuarios_updated_at before update on public.usuarios
for each row execute function public.set_updated_at();

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

-- Políticas mínimas para desenvolvimento (apenas usuários autenticados)
create policy if not exists "auth_read_unidades" on public.unidades_escolares for select to authenticated using (true);
create policy if not exists "auth_read_usuarios" on public.usuarios for select to authenticated using (true);
create policy if not exists "auth_read_delegacoes" on public.delegacoes for select to authenticated using (true);
create policy if not exists "auth_read_logs" on public.logs_auditoria for select to authenticated using (true);
create policy if not exists "auth_read_alunos" on public.alunos for select to authenticated using (true);
create policy if not exists "auth_read_alunos_pcd" on public.alunos_pcd for select to authenticated using (true);
