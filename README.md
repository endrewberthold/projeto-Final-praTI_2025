# Plataforma de estudos — Gabaritando
A plataforma interativa de estudos Gabaritando é voltada para alunos do Ensino Médio e vestibulandos, com foco em questões do **ENEM**.  Este produto foi desenvolvido como projeto final da Formação Desenvolvedor FullStack Júnior, oferecida pela +PraTI  e CodificaEdu.
O sistema promove progressão do aluno em questões organizadas por **área de conhecimento** e por **níveis de dificuldade**, permite a criação de **flashcards** para reforço dos conceitos aprendidos e oferece **métricas** sobre o desempenho do usuário.

---

## Objetivo
Oferecer um ambiente digital inteligente de estudo, que:
- Estimula o aprendizado progressivo com base em acertos;
- Mapeia métricas de desempenho por **área**, **competência** e **habilidade**;
- Gera **feedback imediato** e relatórios de desempenho;
- Reforça o conteúdo com flashcards criados automaticamente.

---

## Conceito pedagógico
A lógica pedagógica se baseia em três pilares:
1. **Repetição ativa:** o aluno só progride ao acertar pelo meno 70% das questões.
3. **Autonomia guiada:** o aluno controla o ritmo, mas o sistema direciona a progressão.

---

## Estrutura do sistema

### **1. Autenticação e perfil**
- Login simples com papéis de acesso:
    - `local` → aluno (usuário principal)
    - `admin` → administrador e gestor de conteúdo
- Cada usuário possui um **profile** com:
    - Nome, e-mail e nível atual;
    - Pontos de XP acumulados;
    - Métricas de desempenho (precisão, tempo médio, áreas dominantes);
    - **Avatar personalizável**

### **2. Sessões de estudo**
- Cada aluno pode iniciar uma **sessão** que controla:
    - Questões apresentadas;
    - Alternativas embaralhadas;
    - Tempo de resposta e número de tentativas;
- Cada resposta é registrada como uma **Attempt**, contendo:
    - ID da questão e alternativa escolhida;
    - Tempo de resposta;
    - Resultado (acerto ou erro);
    - Mapeamento completo da ordem apresentada.

### **3. Sistema de questões**
- Questões classificadas por:
    - **Área** (ex: Matemática e suas Tecnologias);
    - **Competência** (ex: Resolver problemas com proporcionalidade);
    - **Habilidade** (ex: H5 — Resolver problemas que envolvam razão e proporção);
- Cada questão possui:
    - Enunciado, alternativas (A-E) e identificação da correta;
    - Dificuldade (nível 1-5);
    - Relacionamento com **competência** e **habilidade**.

### **4. Progressão e XP**
- A pontuação (XP) é calculada com base na dificuldade da questão e no nível do aluno;
- Acertos concedem XP e podem promover aumento de nível;
- Métricas consolidadas:
    - **totalSessions** — total de sessões realizadas;
    - **avgAnswerTimeMs** — tempo médio de resposta;
    - **topArea**, **topSkills** e **topCompetencies** — destaques baseados em acertos reais.

### **5. Flashcards**
- Criados manualmente a partir de dificuldades encontradas pelo aluno;
- Contêm termo, definição e origem;
- Sistema de busca e filtro por área.
- Podem ser visualizados um por vez, para estudo em ordem aleatória ou de criação.

### **6. Assistente IA**
- Integrada ao Google Gemini, permite a realização de perguntas sobre o conteúdo sem sair da plataforma.

---

## Tecnologias utilizadas

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

## Métricas e monitoramento
Endpoint `/profile/full` retorna um conjunto completo de informações do aluno:
- XP total e nível atual;
- Precisão geral e tempo médio de resposta;
- Áreas, competências e habilidades com **melhor desempenho (baseadas em acertos)**;
- Quantidade de flashcards criados.

**Importante:**  
As métricas de `topArea`, `topSkills` e `topCompetencies` consideram **somente acertos**, evitando distorções estatísticas.

---

## Autenticação
Autenticação via token JWT;
Enviar Authorization: Bearer <token> nos endpoints protegidos.

---

## Estrutura de pastas

```bash
enem_app
├── backend
│   ├── src/main/java/org/plataform/backend
│   │   ├── controllers
│   │   ├── entity
│   │   ├── dtos
│   │   ├── services
│   │   └── ...
│   └── resources/application.properties
│
├── db
│   ├── docker-compose.yml
│   └── init.sql
│
├── frontend
│   ├── public
│   └── src
│       ├── components
│       ├── pages
│       ├── services
│       └── ...
│
├── docker-compose.yml
└── README.md
```

---

### **Principais endpoints**
| Método | Endpoint | Descrição |
|--------|-----------|-----------|
| `POST` | `/auth/login` | Autenticação do usuário |
| `GET` | `/profile/full` | Retorna perfil completo e métricas |
| `POST` | `/sessions/start` | Inicia uma nova sessão de estudo |
| `POST` | `/attempts/submit` | Registra uma tentativa de resposta |
| `GET` | `/flashcards` | Lista flashcards do usuário |
| `POST` | `/flashcards` | Cria novo flashcard |

---

## Estrutura de dados simplificada

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
 ├── id, difficulty, areaId, competencyId, skillId
 └── alternatives (1:N)
```


### Fluxo de dados
- **Extração de dados:** As informações são obtidas a partir de arquivos PDF e CSV. Durante essa etapa, os dados são estruturados e consolidados em um CSV padronizado, com colunas e formatos consistentes.
- **Carga no banco de dados:** O arquivo CSV consolidado é utilizado para popular o banco de dados. Essa carga pode ser realizada manualmente.
- **Persistência via JPA:** O JPA (Java Persistence API) é responsável por gerenciar o mapeamento objeto-relacional, permitindo que os dados extraídos do CSV sejam convertidos em entidades Java e armazenados de forma estruturada no banco. Esse processo garante integridade e abstrai a complexidade das operações SQL.
- **Consulta via API REST:** Quando o sistema é consultado, a API REST realiza buscas no banco de dados, recupera as informações persistidas e as retorna no formato JSON.
- **Consumo pelo Front-end:** O JSON retornado é consumido pela aplicação front-end, que exibe as informações de forma acessível para o usuário final.

---

## Protótipo
Para visualizar o protótipo das telas do projeto, clique [aqui.](https://www.figma.com/proto/R56PLNhQ5zxmcth8wwzz6b/Projeto_V2_?page-id=993%3A546&node-id=993-547&viewport=1830%2C554%2C0.23&t=abmVmcgSjJKXTyU3-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=993%3A547)

---

## Como executar o projeto
### 1. Clonar o repositório

```bash
git clone
cd enem_app
```
A pasta enem_app/ contém o arquivo docker-compose.yml responsável por subir todo o ambiente (backend, frontend e banco de dados).

### 2. Build com Docker
Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina.
Em seguida, execute o comando abaixo para buildar e subir todos os containers:

```bash
docker-compose up --build
```

## 3. Acesso aos serviços
Após o build e inicialização, os serviços principais estarão disponíveis em:
- Frontend (React): http://localhost:5174
- http://localhost:8080/swagger-ui/index.html
- localhost:80/

---

## Contribuições
Este projeto está abertos a melhorias, correções, sugestões e novas funcionalidades.
Para contribuir, faça um fork do repositório, crie uma branch para sua contribuição e abra um PR, assim podemos analisar as contribuições. Procure seguir os padrões de código do projeto.

---

## Equipe & LinkedIn
- [Alexia Sacerdote de Oliveira](https://www.linkedin.com/in/alexiasacerdote/)
- [André Tanuri Lucho](https://www.linkedin.com/in/dev-andre-lucho/)
- [Bernardo Ortiz Ianiak](https://www.linkedin.com/in/bernardoianiak/)
- [Endrew Berthold](https://www.linkedin.com/in/endrew-bert/)
- [Giovanna Adelle](https://www.linkedin.com/in/giovannadelle/)
- [Jakeline Victor Pereira](https://www.linkedin.com/in/jakeline-pereira-488992a4/)
- [Lucas Vieira Bagolin](https://www.linkedin.com/in/lucasbagolin/)
- [Otávio José de Mendonça](https://www.linkedin.com/in/otavio-jos%C3%A9-de-mendon%C3%A7a/)
- [Patrícia Zan de Oliveira](https://www.linkedin.com/in/patriciazandeoliveira/)
