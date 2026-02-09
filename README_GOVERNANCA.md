
# 🏛️ Governança e Delegação - EscolarApp

O sistema EscolarApp utiliza um modelo híbrido de **RBAC (Role-Based Access Control)** e **Delegação Dinâmica**.

## 👑 Níveis de Autoridade
1.  **Gestor (Diretor):** Visão estratégica total. Único que pode delegar funções.
2.  **Operacional Superior (Pedagogia/Secretaria):** Visão completa de seus respectivos silos funcionais.
3.  **Operacional Direto (Professor):** Acesso restrito às suas turmas e diários.
4.  **Acesso Restrito (Portaria/Família):** Dados mínimos necessários para a função específica.

## 🔑 O Motor de Delegação
Um diferencial do EscolarApp é permitir que o Gestor atribua responsabilidades de módulos a usuários de cargos inferiores sem mudar o cargo-base do funcionário. 

**Exemplo Prático:**
Uma funcionária de **Serviços Gerais** pode receber a delegação de **"Gestão de Estoque da Cozinha"**. 
- Ao logar, ela verá apenas o módulo de estoque da cozinha.
- Ela **não** verá dados de alunos, notas ou auditoria.
- A auditoria registrará todas as ações dela sob este privilégio delegado.
