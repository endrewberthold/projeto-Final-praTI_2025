# Estrutura FrontEnd

Este é o frontend da aplicação Gabarita.<br>
Responsavél pela interação do usuário com as informações disponivéis vindas do backend.

## Para rodar o projeto. 🛠

Para conseguir acessar a aplicação frontend você deverá estar com o docker instalado.<br>
Assim na pasta raiz do projeto '/enem-app' deve-se inicializar os container e imagens por meio do comando: <br>
`docker compose up --build`

- Para realizar modificações e evitar criar um novo conteiner toda vez pode-se:

1. Dentro da pasta '/frontend' realizar um `npm i` para instalar as dependências nescessarias.
2. Abrir uma porta rodando a aplicação por meio do comando `npm run dev`.
3. Certificar-se que está rodando na porta `5173` para utilizar o servidor backend.

## Estruturação das pastas. 🗂

### `/components` Contém todos os componentes.

1. Sub componentes que sejam utilizados apenas internamente dentro de outros componentes podem ser criados em escopo local.

### `/pages` Contém todas as páginas utilizadas em router.

1. Os componentes de páginas irão comportar em maioria os chamados de APIs e handle Functions.
2. São responsavéis por renderizar a página completa.

### `/api` Contém a configuração base do axios.

### `/services` Contém todas as chamadas de APIs.

1. API de dados do usuário em userStatusServices.js
2. API de login/registro em userServices.js
3. API de Flashcards, criar, deletar, atualizar em flashcardsServices.js
4. API de habilidades/questões, iniciar, responder, abandonar, finalizar em SkillsServices.js

### `/context` Contém os contextos globais.

1. Provedor de autenticação global;
2. Contexto de animação do navBar;
3. Contexto do tema claro/escuro.

### Estilos.

- Estilos de componentes e pages devem ficar em suas pastas correspondentes dentro de `/styles`

## Extensões que podem lhe ajudar.🙌

1. ES7 + React/Redux/React-Native snippets
2. EsLint
3. Prettier - Code Formatter
4. Sass (.sass only)
