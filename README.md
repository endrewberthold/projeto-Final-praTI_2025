# Plataforma de Estudos ENEM — Habilidades, Competências e Progressão por Níveis

Uma plataforma de aprendizado interativo voltada para alunos do Ensino Médio e vestibulandos, com base nas **competências e habilidades do ENEM**.  
O sistema promove a evolução por **níveis de dificuldade**, controlando o progresso a partir do desempenho real do aluno e permitindo revisões com **flashcards dinâmicos**.

---

## Objetivo

Oferecer um ambiente digital inteligente de estudo, que:
- Estimula o aprendizado progressivo com base em acertos;
- Mapeia métricas de desempenho por **área**, **competência** e **habilidade**;
- Gera **feedback imediato** e relatórios de desempenho;
- Reforça o conteúdo com flashcards criados automaticamente.

---

## Estrutura do Sistema

### **1. Autenticação e Perfil**
- Login simples com papéis de acesso:
    - `local` → aluno (usuário principal)
    - `admin` → administrador e gestor de conteúdo
- Cada usuário possui um **profile** com:
    - Nome, e-mail e nível atual;
    - Pontos de XP acumulados;
    - Métricas de desempenho (precisão, tempo médio, áreas dominantes);
    - **Avatar personalizável**

---

### **2. Sessões de Estudo**
- Cada aluno pode iniciar uma **sessão** que controla:
    - Questões apresentadas;
    - Alternativas embaralhadas;
    - Tempo de resposta e número de tentativas;
- Cada resposta é registrada como uma **Attempt**, contendo:
    - ID da questão e alternativa escolhida;
    - Tempo de resposta;
    - Resultado (acerto ou erro);
    - Mapeamento completo da ordem apresentada.

---

### **3. Sistema de Questões**
- Questões classificadas por:
    - **Área** (ex: Matemática e suas Tecnologias);
    - **Competência** (ex: Resolver problemas com proporcionalidade);
    - **Habilidade** (ex: H5 — Resolver problemas que envolvam razão e proporção);
- Cada questão possui:
    - Enunciado, alternativas e identificação da correta;
    - Dificuldade (nível 1 a 5);
    - Relacionamento com **competência** e **habilidade**.

---

### **4. Progressão e XP**
- A pontuação (XP) é calculada com base na dificuldade da questão e no nível do aluno;
- Acertos concedem XP e podem promover aumento de nível;
- Métricas consolidadas:
    - **totalSessions** — total de sessões realizadas;
    - **avgAnswerTimeMs** — tempo médio de resposta;
    - **topArea**, **topSkills** e **topCompetencies** — destaques baseados em acertos reais.

---

### **5. Flashcards**
- Criados manualmente a partir de dificuldades encontradas pelo aluno;
- Contêm termo, definição e origem;
- Sistema de busca e filtro por área.

---

## Métricas e Monitoramento

Endpoint `/profile/full` retorna um conjunto completo de informações do aluno:
- XP total e nível atual;
- Precisão geral e tempo médio de resposta;
- Áreas, competências e habilidades com **melhor desempenho (baseadas em acertos)**;
- Quantidade de flashcards criados.

**Importante:**  
As métricas de `topArea`, `topSkills` e `topCompetencies` consideram **somente acertos**, evitando distorções estatísticas.

---

## Estrutura de Código (Backend)

### **Principais Pacotes**

```tree
org.plataform.backend
├── userConfiguration
├── config
├── controllers
├── dtos
├── entity
├── repositories
├── security
├── services
└── userRole
```

### **Principais Endpoints**
| Método | Endpoint | Descrição |
|--------|-----------|-----------|
| `POST` | `/auth/login` | Autenticação do usuário |
| `GET` | `/profile/full` | Retorna perfil completo e métricas |
| `POST` | `/sessions/start` | Inicia uma nova sessão de estudo |
| `POST` | `/attempts/submit` | Registra uma tentativa de resposta |
| `GET` | `/flashcards` | Lista flashcards do usuário |
| `POST` | `/flashcards` | Cria novo flashcard |

---

## Tecnologias Utilizadas

### **Backend**
- Java 21
- Spring Boot 3
- Spring Security (JWT)
- JPA / Hibernate
- PostgreSQL
- Lombok
- Swagger UI
- Gemini

### **Frontend**
- React + Vite
- SASS
- Context API
- Axios
- React Router

### **DevOps**
- Docker
- GitHub Actions (CI/CD)

---

## Conceito Pedagógico

A lógica pedagógica se baseia em três pilares:
1. **Repetição ativa:** o aluno só progride ao acertar.
3. **Autonomia guiada:** o aluno controla o ritmo, mas o sistema direciona a progressão.

---

## Estrutura de Dados Simplificada

```tree
User
 ├── id, name, email, xpPoints, level, profileImage
 └── sessions (1:N)

Session
 ├── id, userId, levelId, presentedMapping
 └── attempts (1:N)

Attempt
 ├── questionId, alternativeId, isCorrect, answerTimeMs, xpEarned

Question
 ├── id, statement, difficulty, areaId, competencyId, skillId
 └── alternatives (1:N)
```

## Como executar o projeto
### 1. Clonar o repositório

```bash
git clone
cd enem_app
```
A pasta enem_app/ contém o arquivo docker-compose.yml responsável por subir todo o ambiente (backend, frontend e banco de dados).

### 2. Build com Docker
ertifique-se de ter o Docker e o Docker Compose instalados em sua máquina.
Em seguida, execute o comando abaixo para buildar e subir todos os containers:

```bash
docker-compose up --build
```

## 3. Acesso aos serviços
Após o build e inicialização, os serviços principais estarão disponíveis em:

- Frontend (React): http://localhost:5174
- http://localhost:8080/swagger-ui/index.html
- localhost:80/

## Autenticação

Autenticação via token JWT;

Enviar Authorization: Bearer <token> nos endpoints protegidos.
