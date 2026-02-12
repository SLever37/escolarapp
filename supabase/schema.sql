
-- 1. Remover políticas que causam recursão
DROP POLICY IF EXISTS "usuarios_self_read" ON public.usuarios;
DROP POLICY IF EXISTS "usuarios_admin_read" ON public.usuarios;
DROP FUNCTION IF EXISTS public.get_user_role();

-- 2. Criar função helper que ignora RLS para checar cargos (SECURITY DEFINER)
-- Isso resolve o erro "infinite recursion"
CREATE OR REPLACE FUNCTION public.check_user_role(target_role text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE auth_user_id = auth.uid() 
    AND papel = target_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Outra função para checar se o usuário é "Master" ou "Gestor" (Hierarquia Superior)
CREATE OR REPLACE FUNCTION public.is_high_hierarchy()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.usuarios 
    WHERE auth_user_id = auth.uid() 
    AND papel IN ('admin_plataforma', 'gestor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Habilitar RLS
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS PARA A TABELA "USUARIOS" (Sem recursão)
-- Regra 1: Qualquer usuário autenticado pode ler SEU PRÓPRIO perfil
CREATE POLICY "usuarios_ver_proprio_perfil" ON public.usuarios
FOR SELECT USING (auth.uid() = auth_user_id);

-- Regra 2: Usuários MASTER podem ver TODOS os usuários do sistema
CREATE POLICY "master_ver_tudo" ON public.usuarios
FOR ALL USING (public.check_user_role('admin_plataforma'));

-- Regra 3: GESTORES podem ver usuários da sua própria unidade
CREATE POLICY "gestor_ver_unidade" ON public.usuarios
FOR SELECT USING (
  public.check_user_role('gestor') 
  AND (unidade_id = (SELECT unidade_id FROM public.usuarios WHERE auth_user_id = auth.uid() LIMIT 1))
);

-- 5. APLICAR HIERARQUIA EM OUTRAS TABELAS (Exemplo: Alunos)
ALTER TABLE public.alunos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "master_alunos_total" ON public.alunos
FOR ALL USING (public.check_user_role('admin_plataforma'));

CREATE POLICY "gestor_alunos_unidade" ON public.alunos
FOR ALL USING (
  public.check_user_role('gestor') 
  AND unidade_id = (SELECT unidade_id FROM public.usuarios WHERE auth_user_id = auth.uid() LIMIT 1)
);
