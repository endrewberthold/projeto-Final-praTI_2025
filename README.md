# Plataforma de Estudos ENEM – Habilidades e Níveis

Uma plataforma interativa de estudos voltada para alunos do Ensino Médio e vestibulandos, com foco em questões do ENEM. O sistema promove a progressão por **níveis de dificuldade** dentro de cada **matéria**, agrupadas por **habilidades da prova**. Os alunos só avançam ao acertar as questões, garantindo fixação dos conceitos.

---

## Objetivo

Desenvolver uma aplicação educacional que estimule o aprendizado ativo e gradual através de:
- Questões segmentadas por habilidade, matéria e nível.
- Progresso condicional ao acerto das questões.
- Reforço de conteúdo via flashcards salvos durante a resolução.
- Interface intuitiva e responsiva para uso recorrente por alunos.

---

## Funcionalidades

### 1. **Home**
- Acesso rápido aos principais módulos:
    - Estudar por Habilidade
    - Flashcards (banco de conceitos)
    - Meu Progresso (em desenvolvimento)

### 2. **Estudo por Habilidade**
- Escolha entre habilidades do ENEM (Matemática, Linguagens, etc).
- Cada habilidade lista suas matérias associadas (ex: Álgebra, Português...).
- Cada matéria possui 5 níveis de dificuldade com 10 questões cada.
- O aluno deve acertar a questão atual para desbloquear a próxima.

### 3. **Questões**
- Modal com enunciado e 5 alternativas (A-E).
- Feedback instantâneo sobre a resposta. (Em revisão)
- Avanço somente após acerto.
- Botão para salvar conceitos como flashcards.

### 4. **Flashcards**
- Criados diretamente das questões ou via acesso direto.
- Campos:
    - Termo/Palavra-chave
    - Descrição/Explicação
    - (Opcional) Questão de origem
- Sistema de busca e filtro por matéria/habilidade.

---

## 🧩 Estrutura Lógica do Fluxo

```plaintext
Home
 ├── Estudar por Habilidade
 │    └── Seleção de Habilidade
 │         └── Lista de Matérias
 │              └── Níveis 1-5
 │                   └── Modal de Questão (com acerto obrigatório)
 │                        └── Criar Flashcard
 └── Flashcards
      └── Visualizar / Criar / Editar / Filtrar