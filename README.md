# 🧠 EscolarApp — Central de Governança Escolar

Este projeto implementa um ecossistema digital para gestão educacional baseado em governança institucional e segurança de dados.

## 🎯 Arquitetura de Hierarquia (Auth & RLS)
- **N0 - Master (`admin_plataforma`)**: Provisionamento global.
- **N1 - Gestor (`gestor`)**: Visão total e estratégica da unidade. Dashboard unificado.
- **N2 - Pedagogia (`pedagogia`)**: Supervisão de aprendizagem e Módulo "Grade de Horários".
- **N3 - Secretaria (`secretaria`)**: Gestão legal e documentação.
- **N4 - Professor (`professor`)**: Operacional direto e Diário de Classe.
- **N5 - Família (`familia`)**: Acesso via CPF ao portal do aluno.
- **N6 - Portaria (`portaria`)**: Fluxo de entrada/saída.

## 📂 Organização do Projeto
- `componentes/`: UI base e componentes reutilizáveis.
- `paginas/`: Telas funcionais divididas por cargo.
- `servicos/`: Lógica de integração com Supabase e Context API.
- `tipos/`: Interfaces TypeScript rigorosas.
- `rotas/`: Gestão de permissões e navegação.

## 🗓️ Grade de Horários
Módulo avançado que permite a alocação de disciplinas, professores e salas por turma, com foco em evitar janelas e otimizar a carga horária municipal.

## 🔐 Segurança e PCD (LGPD)
Dados de alunos com necessidades especiais (PCD) são criptografados e restritos a níveis de coordenação e gestão, auditando cada acesso via logs forenses.