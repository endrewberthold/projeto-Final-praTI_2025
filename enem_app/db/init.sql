-- USERS
CREATE TABLE public.users
(
    id_user       BIGSERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    profile_image VARCHAR(255),
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(30)  NOT NULL,
    level         INT          NOT NULL DEFAULT 1,
    xp_points     INT          NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- KNOWLEDGE AREAS
CREATE TABLE public.knowledge_areas
(
    id   VARCHAR(2) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- COMPETENCIES
CREATE TABLE public.competencies
(
    id          BIGSERIAL PRIMARY KEY,
    area_id     VARCHAR(2) NOT NULL REFERENCES knowledge_areas (id),
    description TEXT       NOT NULL
);

-- SKILLS
CREATE TABLE public.skills
(
    id            BIGSERIAL PRIMARY KEY,
    competency_id BIGINT      NOT NULL REFERENCES competencies (id),
    code          VARCHAR(10) NOT NULL,
    description   TEXT        NOT NULL,
    UNIQUE (competency_id, code)
);

-- QUESTIONS
CREATE TABLE public.questions
(
    id            BIGSERIAL PRIMARY KEY,
    area_id       VARCHAR(2)    NOT NULL REFERENCES knowledge_areas (id),
    competency_id BIGINT        NOT NULL REFERENCES competencies (id),
    skill_id      BIGINT        NOT NULL REFERENCES skills (id),
    text          TEXT          NOT NULL,
    difficulty    NUMERIC(3, 1) NOT NULL,
    year          INT,
    image_url     TEXT,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- ALTERNATIVES
CREATE TABLE public.alternatives
(
    id          BIGSERIAL PRIMARY KEY,
    question_id BIGINT      NOT NULL REFERENCES questions (id) ON DELETE CASCADE,
    -- letra de referência (A..E) para vinculação externa; NÃO usada como fonte da verdade de correção
    letter      CHAR(1) CHECK (letter IS NULL OR letter IN ('A', 'B', 'C', 'D', 'E')),
    text        TEXT        NOT NULL,
    is_correct  BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Único índice para evitar letras duplicadas por questão (se usar letter)
CREATE UNIQUE INDEX uq_alternatives_question_letter ON alternatives (question_id, letter) WHERE letter IS NOT NULL;

-- Garante no máximo 1 alternativa marcada como correta por questão
CREATE UNIQUE INDEX ux_one_correct_alternative_per_question ON alternatives (question_id) WHERE is_correct;

-- LEVELS
CREATE TABLE public.levels
(
    id             BIGSERIAL PRIMARY KEY,
    name           VARCHAR(100)  NOT NULL,
    min_difficulty NUMERIC(3, 1) NOT NULL,
    max_difficulty NUMERIC(3, 1) NOT NULL,
    CHECK (min_difficulty <= max_difficulty)
);

-- SESSIONS (simulados/rodadas)
CREATE TABLE public.sessions
(
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT      NOT NULL REFERENCES users (id_user),
    area_id       VARCHAR(2)  NOT NULL REFERENCES knowledge_areas (id),
    level_id      BIGINT      NOT NULL REFERENCES levels (id),
    num_questions INT,
    abandoned     BOOLEAN              DEFAULT FALSE,
    started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at   TIMESTAMPTZ
);

-- ATTEMPTS (respostas dos usuários)
CREATE TABLE public.attempts
(
    id                BIGSERIAL PRIMARY KEY,
    user_id           BIGINT      NOT NULL REFERENCES users (id_user),
    question_id       BIGINT      NOT NULL REFERENCES questions (id),
    alternative_id    BIGINT      NOT NULL REFERENCES alternatives (id),
    is_correct        BOOLEAN     NOT NULL,
    answer_time_ms    INT,
    session_id        BIGINT REFERENCES sessions (id),
    presented_mapping JSONB,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para attempts
CREATE INDEX ix_attempts_user_question ON attempts (user_id, question_id);
CREATE INDEX ix_attempts_question ON attempts (question_id);
CREATE INDEX ix_attempts_user ON attempts (user_id);

-- USER_LEVELS (progressão por área)
CREATE TABLE public.user_levels
(
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT     NOT NULL REFERENCES users (id_user),
    area_id      VARCHAR(2) NOT NULL REFERENCES knowledge_areas (id),
    level_id     BIGINT     NOT NULL REFERENCES levels (id),
    completed    BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX ux_user_area_level ON user_levels (user_id, area_id, level_id);

-- ACHIEVEMENTS
CREATE TABLE public.achievements
(
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT      NOT NULL REFERENCES users (id_user),
    skill_id    BIGINT      NOT NULL REFERENCES skills (id),
    achieved_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_achievements_user ON achievements (user_id);
CREATE INDEX ix_achievements_skill ON achievements (skill_id);

-- FLASHCARDS
CREATE TABLE public.flashcards
(
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT       NOT NULL REFERENCES users (id_user),
    question_id BIGINT,
    area_id     VARCHAR(2)   NOT NULL REFERENCES knowledge_areas (id),
    term        VARCHAR(255) NOT NULL,
    description TEXT         NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX ix_flashcards_user ON flashcards (user_id);

-- TOKENS (JWTs ou refresh tokens)
CREATE TABLE public.tokens
(
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT      NOT NULL REFERENCES users (id_user),
    token      TEXT        NOT NULL UNIQUE,
    revoked    BOOLEAN              DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX ix_tokens_user ON tokens (user_id);

-- PASSWORD RESET
CREATE TABLE public.password_reset
(
    id         BIGSERIAL PRIMARY KEY,
    token      VARCHAR(255) NOT NULL UNIQUE,
    user_id    BIGINT       NOT NULL REFERENCES users (id_user),
    expires_at TIMESTAMPTZ  NOT NULL,
    used       BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES ADICIONAIS SUGERIDOS
CREATE INDEX ix_questions_difficulty ON questions (difficulty);
CREATE INDEX ix_questions_area_competency_skill ON questions (area_id, competency_id, skill_id);
CREATE INDEX ix_skills_competency ON skills (competency_id);

--Inserção de dados

INSERT INTO public.knowledge_areas (id, name)
VALUES ('LC', 'Linguagens, Códigos e suas Tecnologias'),
       ('CH', 'Ciências Humanas e suas Tecnologias'),
       ('CN', 'Ciências da Natureza e suas Tecnologias'),
       ('MT', 'Matemática e suas Tecnologias');


INSERT INTO levels (name, min_difficulty, max_difficulty)
VALUES ('Muito Fácil', 1, 2),
       ('Fácil', 3, 4),
       ('Médio', 5, 6),
       ('Difícil', 7, 8),
       ('Muito Difícil', 9, 10);

INSERT INTO competencies (area_id, description)
VALUES ('LC',
        'Aplicar as tecnologias da comunicacao e da informacao na escola, no trabalho e em outros contextos relevantes para sua vida.'),
       ('LC',
        'Conhecer e usar linguas estrangeiras modernas como instrumento de acesso a informacoes e a outras culturas e grupos sociais.'),
       ('LC',
        'Compreender e usar a linguagem corporal como relevante para a propria vida, integradora social e formadora da identidade.'),
       ('LC',
        'Compreender a arte como saber cultural e estetico gerador de significacao e integrador da organizacao do mundo e da propria identidade.'),
       ('LC',
        'Analisar, interpretar e aplicar recursos expressivos das linguagens, relacionando textos com seus contextos, mediante a natureza, funcao, organizacao e estrutura das manifestacoes.'),
       ('LC',
        'Compreender e usar os sistemas simbolicos das diferentes linguagens como meios de organizacao cognitiva da realidade pela constituicao de significados, expressao, comunicacao e informacao.'),
       ('LC', 'Confrontar opiniões e pontos de vista sobre as diferentes linguagens e suas manifestações específicas.'),
       ('LC',
        'Compreender e usar a língua portuguesa como língua materna, geradora de significação e integradora da organização do mundo e da própria identidade.'),
       ('LC',
        'Entender os princípios, a natureza, a função e o impacto das tecnologias da comunicação e da informação na sua vida pessoal e social, no desenvolvimento do conhecimento, associando-o aos conhecimentos científicos, às linguagens que lhes dão suporte, às demais tecnologias, aos processos de produção e aos problemas que se propõem solucionar.');

INSERT INTO competencies (area_id, description)
VALUES
    ('MT', 'Construir significados para os números naturais, inteiros, racionais e reais.'),
    ('MT',
     'Utilizar o conhecimento geométrico para realizar a leitura e a representação da realidade e agir sobre ela.'),
    ('MT',
     'Construir noções de grandezas e medidas para a compreensão da realidade e a solução de problemas do cotidiano.'),
    ('MT',
     'Construir noções de variação de grandezas para a compreensão da realidade e a solução de problemas do cotidiano.'),
    ('MT',
     'Modelar e resolver problemas que envolvem variáveis socioeconômicas ou técnico-científicas, usando representações algébricas.'),
    ('MT',
     'Interpretar informações de natureza científica e social obtidas da leitura de gráficos e tabelas, realizando previsão de tendência, extrapolação, interpolação e interpretação.'),
    ('MT',
     'Compreender o caráter aleatório e não-determinístico dos fenômenos naturais e sociais e utilizar instrumentos adequados para medidas, determinação de amostras e cálculos de probabilidade para interpretar informações de variáveis apresentadas em uma distribuição estatística.');

INSERT INTO competencies (area_id, description)
VALUES
    ('CN', 'Compreender as ciências naturais e as tecnologias a elas associadas como construções humanas, percebendo seus papéis nos processos de produção e no desenvolvimento econômico e social da humanidade..'),
    ('CN', 'Identificar a presença e aplicar as tecnologias associadas às ciências naturais em diferentes contextos.'),
    ('CN', 'Associar intervenções que resultam em degradação ou conservação ambiental a processos produtivos e sociais e a instrumentos ou ações científico-tecnológicos.'),
    ('CN', 'Compreender interações entre organismos e ambiente, em particular aquelas relacionadas à saúde humana, relacionando conhecimentos científicos, aspectos culturais e características individuais.'),
    ('CN', 'Entender métodos e procedimentos próprios das ciências naturais e aplicá-los em diferentes contextos.'),
    ('CN', 'Apropriar-se de conhecimentos da física para, em situações problema, interpretar, avaliar ou planejar intervenções científico- tecnológicas.'),
    ('CN', 'Apropriar-se de conhecimentos da química para, em situações problema, interpretar, avaliar ou planejar intervenções científico-tecnológicas.'),
    ('CN', 'Apropriar-se de conhecimentos da biologia para, em situações problema, interpretar, avaliar ou planejar intervenções científico- tecnológicas');

INSERT INTO competencies (area_id, description)
VALUES ('CN', 'Compreender os elementos culturais que constituem as
identidades'),
       ('CH',
        'Compreender as transformações dos espaços geográficos como produto das relações socioeconômicas e culturais de poder.'),
       ('CH', 'Compreender a produção e o papel histórico das instituições sociais, políticas e econômicas, associando-as aos diferentes grupos, conflitos e movimentos sociais.'),
       ('CH', 'Entender as transformações técnicas e tecnológicas e seu impacto nos processos de produção, no desenvolvimento do conhecimento e na vida social.'),
       ('CH', 'Utilizar os conhecimentos históricos para compreender e valorizar os fundamentos da cidadania e da democracia, favorecendo uma atuação consciente do indivíduo na sociedade.'),
       ('CH', 'Compreender a sociedade e a natureza, reconhecendo suas interações no espaço em diferentes contextos históricos e geográficos.');

INSERT INTO skills (competency_id, code, description)
VALUES

    (1, 'H1',
     'Identificar as diferentes linguagens e seus recursos expressivos como elementos de caracterizacao dos sistemas de comunicacao.'),
    (1, 'H2',
     'Recorrer aos conhecimentos sobre as linguagens dos sistemas de comunicacao e informacao para resolver problemas sociais.'),
    (1, 'H3',
     'Relacionar informacoes geradas nos sistemas de comunicacao e informacao, considerando a funcao social desses sistemas.'),
    (1, 'H4',
     'Reconhecer posicoes criticas aos usos sociais que sao feitos das linguagens e dos sistemas de comunicacao e informacao.'),

    (2, 'H5', 'Associar vocabulos e expressoes de um texto em LEM ao seu tema.'),
    (2, 'H6',
     'Utilizar os conhecimentos da LEM e de seus mecanismos como meio de ampliar as possibilidades de acesso a informacoes, tecnologias e culturas.'),
    (2, 'H7', 'Relacionar um texto em LEM, as estruturas linguisticas, sua funcao e seu uso social.'),
    (2, 'H8',
     'Reconhecer a importancia da producao cultural em LEM como representacao da diversidade cultural e linguistica.'),

    (3, 'H9',
     'Reconhecer as manifestacoes corporais de movimento como originarias de necessidades cotidianas de um grupo social.'),
    (3, 'H10', 'Reconhecer a necessidade de transformacao de habitos corporais em funcao das necessidades cinestesicas.'),
    (3, 'H11',
     'Reconhecer a linguagem corporal como meio de interacao social, considerando os limites de desempenho e as alternativas de adaptacao para diferentes individuos.'),

    (4, 'H12', 'Reconhecer diferentes funcoes da arte, do trabalho da producao dos artistas em seus meios culturais.'),
    (4, 'H13',
     'Analisar as diversas producoes artisticas como meio de explicar diferentes culturas, padroes de beleza e preconceitos.'),
    (4, 'H14',
     'Reconhecer o valor da diversidade artistica e das inter-relacoes de elementos que se apresentam nas manifestacoes de varios grupos sociais e etnicos.'),

    (5, 'H15',
     'Estabelecer relacoes entre o texto literario e o momento de sua producao, situando aspectos do contexto historico, social e politico.'),
    (5, 'H16', 'Relacionar informacoes sobre concepcoes artisticas e procedimentos de construcao do texto literario.'),
    (5, 'H17',
     'Reconhecer a presenca de valores sociais e humanos atualizaveis e permanentes no patrimonio literario nacional.'),

    (6, 'H18',
     'Identificar os elementos que concorrem para a progressao tematica e para a organizacao e estruturacao de textos de diferentes generos e tipos.'),
    (6, 'H19', 'Analisar a funcao da linguagem predominante nos textos em situacoes especificas de interlocucao.'),
    (6, 'H20',
     'Reconhecer a importancia do patrimonio linguistico para a preservacao da memoria e da identidade nacional.'),

    (7, 'H21',
     'Reconhecer em textos de diferentes gêneros, recursos verbais e não-verbais utilizados com a finalidade de criar e mudar comportamentos e hábitos.'),
    (7, 'H22', 'Relacionar, em diferentes textos, opiniões, temas, assuntos e recursos linguísticos.'),
    (7, 'H23',
     'Inferir em um texto quais são os objetivos de seu produtor e quem é seu público alvo, pela análise dos procedimentos argumentativos utilizados.'),
    (7, 'H24',
     'Reconhecer no texto estratégias argumentativas empregadas para o convencimento do público, tais como a intimidação, sedução, comoção, chantagem, entre outras.'),

    (8, 'H25',
     'Identificar, em textos de diferentes gêneros, as marcas linguísticas que singularizam as variedades linguísticas sociais, regionais e de registro.'),
    (8, 'H26', 'Relacionar as variedades linguísticas a situações específicas de uso social.'),
    (8, 'H27', 'Reconhecer os usos da norma padrão da língua portuguesa nas diferentes situações de comunicação.'),

    (9, 'H28', 'Reconhecer a função e o impacto social das diferentes tecnologias da comunicação e informação.'),
    (9, 'H29', 'Identificar pela análise de suas linguagens, as tecnologias da comunicação e informação.'),
    (9, 'H30',
     'Relacionar as tecnologias de comunicação e informação ao desenvolvimento das sociedades e ao conhecimento que elas produzem.');

INSERT INTO skills (competency_id, code, description)
VALUES (10, 'H1',
        'Reconhecer, no contexto social, diferentes significados e representações dos números e operações - naturais, inteiros, racionais ou reais.'),
       (10, 'H2', 'Identificar padrões numéricos ou princípios de contagem.'),
       (10, 'H3', 'Resolver situação-problema envolvendo conhecimentos numéricos.'),
       (10, 'H4',
        'Avaliar a razoabilidade de um resultado numérico na construção de argumentos sobre afirmações quantitativas.'),
       (10, 'H5', 'Avaliar propostas de intervenção na realidade utilizando conhecimentos numéricos.'),

       (11, 'H6',
        'Interpretar a localização e a movimentação de pessoas/objetos no espaço tridimensional e sua representação no espaço bidimensional.'),
       (11, 'H7', 'Identificar características de figuras planas ou espaciais.'),
       (11, 'H8', 'Resolver situação-problema que envolva conhecimentos geométricos de espaço e forma.'),
       (11, 'H9',
        'Utilizar conhecimentos geométricos de espaço e forma na seleção de argumentos propostos como solução de problemas do cotidiano.'),

       (12, 'H10', 'dentificar relações entre grandezas e unidades de medida.'),
       (12, 'H11', 'Utilizar a noção de escalas na leitura de representação de situação do cotidiano.'),
       (12, 'H12', 'Resolver situação-problema que envolva medidas de grandezas.'),
       (12, 'H13', 'Avaliar o resultado de uma medição na construção de um argumento consistente.'),
       (12, 'H14',
        'Avaliar proposta de intervenção na realidade utilizando conhecimentos geométricos relacionados a grandezas e medidas.'),

       (13, 'H15', 'Identificar a relação de dependência entre grandezas.'),
       (13, 'H16',
        'Resolver situação-problema envolvendo a variação de grandezas, direta ou inversamente proporcionais.'),
       (13, 'H17',
        'Analisar informações envolvendo a variação de grandezas como recurso para a construção de argumentação.'),
       (13, 'H18', 'Avaliar propostas de intervenção na realidade envolvendo variação de grandezas.'),

       (14, 'H19', 'Identificar representações algébricas que expressem a relação entre grandezas.'),
       (14, 'H20', 'Interpretar gráfico cartesiano que represente relações entre grandezas.'),
       (14, 'H21', 'Resolver situação-problema cuja modelagem envolva conhecimentos algébricos.'),
       (14, 'H22', 'Utilizar conhecimentos algébricos/geométricos como recurso para a construção de argumentação.'),
       (14, 'H23', 'Avaliar propostas de intervenção na realidade utilizando conhecimentos algébricos.'),

       (15, 'H24', 'Utilizar informações expressas em gráficos ou tabelas para fazer inferências.'),
       (15, 'H25', 'Resolver problema com dados apresentados em tabelas ou gráficos.'),
       (15, 'H26', 'Analisar informações expressas em gráficos ou tabelas como recurso para a construção de argumentos.'),

       (16, 'H27',
        'Calcular medidas de tendência central ou de dispersão de um conjunto de dados expressos em uma tabela de frequências de dados agrupados (não em classes) ou em gráficos.'),
       (16, 'H28', 'Resolver situação-problema que envolva conhecimentos de estatística e probabilidade.'),
       (16, 'H29',
        'Utilizar conhecimentos de estatística e probabilidade como recurso para a construção de argumentação.'),
       (16, 'H30',
        'Avaliar propostas de intervenção na realidade utilizando conhecimentos de estatística e probabilidade.');

INSERT INTO skills (competency_id, code, description)
VALUES

    (17, 'H1',
     'Reconhecer características ou propriedades de fenômenos ondulatórios ou oscilatórios, relacionando-os a seus usos em diferentes contextos.'),
    (17, 'H2', 'Associar a solução de problemas de comunicação, transporte, saúde ou outro, com o correspondente desenvolvimento científico e tecnológico.'),
    (17, 'H3', 'Confrontar interpretações científicas com interpretações baseadas no senso comum, ao longo do tempo ou em diferentes culturas.'),
    (17, 'H4',
     'Avaliar propostas de intervenção no ambiente, considerando a qualidade da vida humana ou medidas de conservação, recuperação ou utilização sustentável da biodiversidade.'),

    (18, 'H5',
     'Dimensionar circuitos ou dispositivos elétricos de uso cotidiano.'),
    (18, 'H6',
     'Relacionar informações para compreender manuais de instalação ou utilização de aparelhos, ou sistemas tecnológicos de uso comum.'),
    (18, 'H7', 'Selecionar testes de controle, parâmetros ou critérios para a comparação de materiais e produtos, tendo em vista a defesa do consumidor, a saúde do trabalhador ou a qualidade de vida.'),

    (19, 'H8', 'Identificar etapas em processos de obtenção, transformação, utilização ou reciclagem de recursos naturais, energéticos ou matérias-primas, considerando processos biológicos, químicos ou físicos neles envolvidos.'),
    (19, 'H9',
     'Compreender a importância dos ciclos biogeoquímicos ou do fluxo energia para a vida, ou da ação de agentes ou fenômenos que podem causar alterações nesses processos.'),
    (19, 'H10', 'Analisar perturbações ambientais, identificando fontes, transporte e(ou) destino dos poluentes ou prevendo efeitos em sistemas naturais, produtivos ou sociais.'),
    (19, 'H11', 'Reconhecer benefícios, limitações e aspectos éticos da biotecnologia, considerando estruturas e processos biológicos envolvidos em produtos biotecnológicos.'),
    (19, 'H12', 'Avaliar impactos em ambientes naturais decorrentes de atividades sociais ou econômicas, considerando interesses contraditórios.'),

    (20, 'H13', 'Reconhecer mecanismos de transmissão da vida, prevendo ou explicando a manifestação de características dos seres vivos.'),
    (20, 'H15', 'Identificar padrões em fenômenos e processos vitais dos organismos, como manutenção do equilíbrio interno, defesa, relações com o ambiente, sexualidade, entre outros.'),
    (20, 'H16', 'Compreender o papel da evolução na produção de padrões, processos biológicos ou na organização taxonômica dos seres vivos.'),

    (21, 'H17', 'Relacionar informações apresentadas em diferentes formas de linguagem e representação usadas nas ciências físicas, químicas ou biológicas, como texto discursivo, gráficos, tabelas, relações matemáticas ou linguagem simbólica.'),
    (21, 'H18', 'Relacionar propriedades físicas, químicas ou biológicas de produtos, sistemas ou procedimentos tecnológicos às finalidades a que se destinam.'),
    (21, 'H19', 'Avaliar métodos, processos ou procedimentos das ciências naturais que contribuam para diagnosticar ou solucionar problemas de ordem social, econômica ou ambiental.'),

    (22, 'H20', 'Caracterizar causas ou efeitos dos movimentos de partículas, substâncias, objetos ou corpos celestes.'),
    (22, 'H21', 'Utilizar leis físicas e (ou) químicas para interpretar processos naturais ou tecnológicos inseridos no contexto da termodinâmica e(ou) do eletromagnetismo.'),
    (22, 'H22', 'Compreender fenômenos decorrentes da interação entre a radiação e a matéria em suas manifestações em processos naturais ou tecnológicos, ou em suas implicações biológicas, sociais, econômicas ou ambientais.'),
    (22, 'H23', 'Avaliar possibilidades de geração, uso ou transformação de energia em ambientes específicos, considerando implicações éticas, ambientais, sociais e/ou econômicas.'),

    (23, 'H24', 'Utilizar códigos e nomenclatura da química para caracterizar materiais, substâncias ou transformações químicas.'),
    (23, 'H25', 'Caracterizar materiais ou substâncias, identificando etapas, rendimentos ou implicações biológicas, sociais, econômicas ou ambientais de sua obtenção ou produção.'),
    (23, 'H26', 'Avaliar implicações sociais, ambientais e/ou econômicas na produção ou no consumo de recursos energéticos ou minerais, identificando transformações químicas ou de energia envolvidas nesses processos.'),
    (23, 'H27', 'Avaliar propostas de intervenção no meio ambiente aplicando conhecimentos químicos, observando riscos ou benefícios.'),

    (24, 'H28', 'Associar características adaptativas dos organismos com seu modo de vida ou com seus limites de distribuição em diferentes ambientes, em especial em ambientes brasileiros.'),
    (24, 'H29', 'Interpretar experimentos ou técnicas que utilizam seres vivos, analisando implicações para o ambiente, a saúde, a produção de alimentos, matérias primas ou produtos industriais.'),
    (24, 'H30', 'Avaliar propostas de alcance individual ou coletivo, identificando aquelas que visam à preservação e a implementação da saúde individual, coletiva ou do ambiente.');

INSERT INTO skills (competency_id, code, description)
VALUES

    (25, 'H1',
     'Interpretar historicamente e/ou geograficamente fontes documentais acerca de aspectos da cultura.'),
    (25, 'H2', 'Analisar a produção da memória pelas sociedades humanas.'),
    (25, 'H3', 'Associar as manifestações culturais do presente aos seus processos históricos.'),
    (25, 'H4',
     'Comparar pontos de vista expressos em diferentes fontes sobre determinado aspecto da cultura.'),
    (25, 'H5',
     'Identificar as manifestações ou representações da diversidade do patrimônio cultural e artístico em diferentes sociedades.'),

    (26, 'H6',
     'Interpretar diferentes representações gráficas e cartográficas dos espaços geográficos.'),
    (26, 'H7', 'Identificar os significados histórico-geográficos das relações de poder entre as nações'),
    (26, 'H8', 'Analisar a ação dos estados nacionais no que se refere à dinâmica dos fluxos populacionais e no enfrentamento de problemas de ordem econômico-social.'),
    (26, 'H9',
     'Comparar o significado histórico-geográfico das organizações políticas e socioeconômicas em escala local, regional ou mundial.'),
    (26, 'H10', 'Reconhecer a dinâmica da organização dos movimentos sociais e a importância da participação da coletividade na transformação da realidade histórico-geográfica.'),

    (27, 'H11', 'Identificar registros de práticas de grupos sociais no tempo e no espaço.'),
    (27, 'H12', 'Analisar o papel da justiça como instituição na organização das sociedades.'),
    (27, 'H13', 'Analisar a atuação dos movimentos sociais que contribuíram para mudanças ou rupturas em processos de disputa pelo poder.'),
    (27, 'H14', 'Comparar diferentes pontos de vista, presentes em textos analíticos e interpretativos, sobre situação ou fatos de natureza histórico-geográfica acerca das instituições sociais, políticas e econômicas.'),
    (27, 'H15', 'Avaliar criticamente conflitos culturais, sociais, políticos, econômicos ou ambientais ao longo da história.'),

    (28, 'H16', 'Identificar registros sobre o papel das técnicas e tecnologias na organização do trabalho e/ou da vida social.'),
    (28, 'H17', 'Analisar fatores que explicam o impacto das novas tecnologias no processo de territorialização da produção.'),
    (28, 'H18', 'Analisar diferentes processos de produção ou circulação de riquezas e suas implicações sócio-espaciais.'),
    (28, 'H19', 'Reconhecer as transformações técnicas e tecnológicas que determinam as várias formas de uso e apropriação dos espaços rural e urbano.'),
    (28, 'H20', 'Selecionar argumentos favoráveis ou contrários às modificações impostas pelas novas tecnologias à vida social e ao mundo do trabalho.'),

    (29, 'H21', 'Identificar o papel dos meios de comunicação na construção da vida social.'),
    (29, 'H22', 'Analisar as lutas sociais e conquistas obtidas no que se refere às mudanças nas legislações ou nas políticas públicas.'),
    (29, 'H23', 'Analisar a importância dos valores éticos na estruturação política das sociedades.'),
    (29, 'H24', 'Relacionar cidadania e democracia na organização das sociedades.'),
    (29, 'H25', 'Identificar estratégias que promovam formas de inclusão social.'),

    (30, 'H26', 'Identificar em fontes diversas o processo de ocupação dos meios físicos e as relações da vida humana com a paisagem.'),
    (30, 'H27', 'Analisar de maneira crítica as interações da sociedade com o meio físico, levando em consideração aspectos históricos e(ou) geográficos.'),
    (30, 'H28', 'Relacionar o uso das tecnologias com os impactos sócio-ambientais em diferentes contextos histórico-geográficos.'),
    (30, 'H29', 'Reconhecer a função dos recursos naturais na produção do espaço geográfico, relacionando-os com as mudanças provocadas pelas ações humanas.'),
    (30, 'H30', 'Avaliar as relações entre preservação e degradação da vida no planeta nas diferentes escalas.');

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 6, 20,
        'Expressões e termos utilizados no Amazonas são retratados em livro e em camisetas "Na linguagem, podemos nos ver da forma mais verdadeira: nossas crenças, nossos valores, nosso lugar no mundo", afirmou o doutor em linguística e professor da Ufam em seu livro Amazonês: expressões e termos usados no Amazonas . Portanto, o amazonense, com todas as suas "cunhantãs" e "curumins", acaba por encontrar um lugar no mundo e formar uma unidade linguística, informalmente denominada de português "caboco", que muito se diferencia do português "mineiro", "gaúcho", "carioca" e de tantos outros espalhados pelo Brasil. O livro, que conta com cerca de 1 100 expressões e termos típicos do falar amazonense, levou dez anos para ser construído. Para o autor, o principal objetivo da obra é registrar a linguagem. Um designer amazonense também acha o amazonês "xibata", tanto é que criou uma série de camisetas estampadas com o nome de Caboquês Ilustrado, que mistura o bom humor com as expressões típicas da região. A coleção conta com sete modelos já lançados, entre eles: Leseira Baré, Xibata no Balde e Até o Tucupi, e 43 ainda na fila de espera. Para o criador, as camisetas têm como objetivo "resgatar o orgulho do povo manauara, do povo do Norte". Disponível em: https://g1.globo.com. Acesso em 15 jan. 2024 (adaptado). A reportagem apresenta duas iniciativas: o livro Amazonês e as camisetas do Caboquês Ilustrado. Com temática em comum, essas iniciativas',
        1);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'recomendam produtos feitos por empreendedores da região Norte.', false),
       (currval('questions_id_seq'), 'B', 'ressaltam diferenças entre o falar manauara e outros falares.', false),
       (currval('questions_id_seq'), 'C', 'reverenciam o trabalho feito por pesquisadores brasileiros.', false),
       (currval('questions_id_seq'), 'D', 'destacam a descontração no jeito de ser do amazonense.', false),
       (currval('questions_id_seq'), 'E', 'valorizam o repertório linguístico do povo do Amazonas.', true);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 1, 3,
        'Conheça histórias de atletas paralímpicas que trocaram de modalidade durante a carreira esportiva Jane Karla: a goiana de 45 anos teve poliomielite aos três anos, o que prejudicou seus movimentos das pernas. Em 2003, iniciou no tênis de mesa e conseguiu conquistar títulos nacionais e internacionais. Mas conheceu o tiro com arco e, em 2015, optou por se dedicar somente à nova modalidade. Em seu ano de estreia no tiro, já faturou a medalha de ouro nos jogos Parapan-Americanos de Toronto 2015. Elizabeth Gomes: a santista de 55 anos era jogadora de vôlei quando foi diagnosticada com esclerose múltipla em 1993. Ingressou no Movimento Paralímpico pelo basquete em cadeira de rodas até experimentar o atletismo. Chegou a praticar as duas modalidades simultaneamente até optar pelas provas de campo em 2010. No Campeonato Mundial de Atletismo, realizado em Dubai, em 2019, Beth se sagrou a campeã do lançamento de disco e estabeleceu um novo recorde mundial da classe F52. Silvana Fernandes : a paraibana de 21 anos é natural de São Bento e nasceu com malformação no braço direito. Aos 15 anos, começou a praticar atletismo no lançamento de dardo. Em 2018, enquanto competia na regional Norte-Nordeste, foi convidada para conhecer o paratae kwon do. No ano seguinte, migrou para a modalidade e já faturou o ouro na categoria até 58 kg nos Jogos Parapan-Americanos de Lima 2019. Disponível em: https://cpb.org.br. Acesso em: 15 jan. 2024 (adaptado). Esse conjunto de minibiografias tem como propósito',
        1);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'descrever as rotinas de treinamento das atletas.', false),
       (currval('questions_id_seq'), 'B', 'comparar os desempenhos de atletas de alto rendimento.', false),
       (currval('questions_id_seq'), 'C', 'destacar a trajetória profissional de atletas paralímpicas brasileiras.',
        true),
       (currval('questions_id_seq'), 'D', 'indicar as categorias mais adequadas a adaptações paralímpicas.', false),
       (currval('questions_id_seq'), 'E', 'estimular a participação de mulheres em campeonatos internacionais.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 4, 14,
        'É fundamentalmente no Minho, norte de Portugal, que o cavaquinho aparece como instrumento tipicamente popular, ligado às formas essenciais da música característica dessa província. O cavaquinho minhoto tem escala rasa com o tampo, o que facilita a prática do "rasqueado". O cavaquinho chega ao Brasil diretamente de Portugal, e o modelo brasileiro é maior do que a sua versão portuguesa, com uma caixa de ressonância mais funda. Semelhante ao cavaquinho minhoto, o machete, ou machetinho madeirense, é um pequeno cordófono de corda dedilhada, que faz parte da grande e diversificada família das violas de mão portuguesas. O ukulele tem sua origem no século XIX, tendo como ancestrais o braguinha (ou machete) e o rajão, instrumentos levados pelos madeirenses quando eles emigraram para o Havaí. OLIVEIRA, E. V. Cavaquinhos e família . Disponível em: https://casadaguitarra.pt . Acesso em: 18 nov. 2021 (adaptado). O conjunto dessas práticas musicais demonstra que os instrumentos mencionados no texto',
        1);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'refletem a dependência da utilização de matéria-prima europeia.', false),
       (currval('questions_id_seq'), 'B', 'adaptam suas características a cada cultura, assumindo nova identidade.',
        true),
       (currval('questions_id_seq'), 'C', 'comprovam a hegemonia portuguesa na invenção de cordófonos dedilhados.',
        false),
       (currval('questions_id_seq'), 'D',
        'ilustram processos de dominação cultural, evidenciando situações de choque cultural.', false),
       (currval('questions_id_seq'), 'E',
        'mantêm nomenclatura própria para garantir a fidelidade às formas originais de confecção.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 3, 10,
        'Pressão, depressão, estresse e crise de ansiedade. Os males da sociedade contemporânea também estão no esporte. A tenista Naomi Osaka, do Japão, jogadora mais bem paga do mundo e que já ocupou o número 2 do ranking, retirou-se do torneio de Roland Garros de 2021 porque não estava conseguindo administrar as crises de ansiedade provocadas pelos grandes eventos, por ser uma estrela aos 23 anos, e pelo peso de parte da impresnsa. O tenista australiano Nick Kyrgios, de 25 anos, revelou sua “situação triste e solitária” enquanto lutava contra a depressão causada pelo ritmo avassalador do Circuito Mundial de Tênis. O jogador de basquete americano Kevin Love também tornou público seu quadro de ansiedade e depressão. O mundo do atleta é solitário e distante da família. O que vemos numa partida não reflete a rotina desgastante. A imprensa denomina atletas como heróis, como se aquele corpo fosse indestrutível, mas a mente é o ponto fraco da história. Disponível em: www.uol.com.br. Acesso em: 31 out. 2021 (adaptado). As causas do desequilíbrio na saúde mental apontadas no texto estão relacionadas às',
        1);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'nacionalidades diversificadas dos praticantes.', false),
       (currval('questions_id_seq'), 'B', 'modalidades esportivas distintas.', false),
       (currval('questions_id_seq'), 'C', 'faixas etárias aproximadas.', false),
       (currval('questions_id_seq'), 'D', 'representações heroicas dos atletas.', false),
       (currval('questions_id_seq'), 'E', 'pressões constantes dos eventos na mídia.', true);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 9, 29,
        'Já ouvi gente falando que o podcast é o renascimento do rádio. O rádio é genial, uma mídia imorredoura, mas podcast não tem nada a ver com ele. O formato está mais próximo do ensaio literário do que de um programa de ondas curtas, médias ou longas. Podcasts são antípodas das redes sociais. Enquanto elas são dispersivas, levam à evasão e à desinformação, os podcasts são uma possibilidade de imersão, concentração, aprendizado. Depois que eles surgiram, lavar a louça e me locomover pela cidade viraram um programaço. Um pós-almoço de domingo e aprendo tudo sobre bonobos e gorilas. Um táxi pro aeroporto e chego ao embarque PhD em reforma tributária. PRATA, A. Disponível em: www1.folha.uol.com.br. Acesso em: 7 jan. 2024 (adaptado). Segundo a argumentação construída nesse texto, o podcast',
        7);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'provoca dispersão da atenção em seu público.', false),
       (currval('questions_id_seq'), 'B', 'funciona por meio de uma frequência de ondas curtas.', false),
       (currval('questions_id_seq'), 'C', 'Considerar apenas o texto mais curto', true),
       (currval('questions_id_seq'), 'D', 'tem um formato de interação semelhante ao das redes sociais.', false),
       (currval('questions_id_seq'), 'E', 'constitui uma evolução na transmissão de informações via rádio.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 8, 26,
        'Evanildo Bechara prepara a sua aposentadoria de pouco em pouco, como se a adiasse ao máximo. Aos 95 anos, o imortal da Academia Brasileira de Letras (ABL) alcançou um status de astro pop no mundo da filologia e da gramática. Quando ainda tinha saúde para viagens mais longas, o filólogo lotava plateias em suas palestras na Europa e no Brasil, que não raro terminavam com filas para selfies. A idade acentuou o lado "cientista" e professoral de Bechara, que adota um tom técnico na conversa até mesmo diante das perguntas mais pessoais. — "Qual o seu tipo preferido de leitura?". — "A minha leitura está dividida em duas partes, a científica e a literária, estabelecendo uma relação de causa e efeito entre elas." — responde. Ainda adolescente, Bechara descobriu a lexicologia. Um "novo mundo" se abriu para o pernambucano, que se mantém atento às metamorfoses do nosso idioma. Seu colega de ABL, o filólogo Ricardo Cavaliere, se lembra de quando deu carona para o mestre e este encucou com os estrangeirismos do aplicativo de navegação instalado no veículo. — "A vozinha do aplicativo avisou que havia um radar de velocidade ''reportado'' à frente", lembra Cavaliere. — "Esse ''reportado'' é uma importação, né?", notou Bechara. Disponível em: https://oglobo.globo.com. Acesso em: 3 jan. 2024 (adaptado). Nesse texto, as falas atribuídas a Evanildo Bechara são representativas da variedade linguística',
        2);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'situacional, pois o contexto exige o uso da linguagem formal.', false),
       (currval('questions_id_seq'), 'B', 'regional, pois ele traz marcas do falar de seu local de nascimento.', false),
       (currval('questions_id_seq'), 'C', 'sociocultural, pois sua formação pressupõe o uso de linguagem rebuscada.',
        false),
       (currval('questions_id_seq'), 'D', 'geracional, pois ele emprega termos característicos de sua faixa etária.',
        false),
       (currval('questions_id_seq'), 'E', 'ocupacional, pois ele faz uso de termos específicos de sua área de atuação.',
        true);


-- Questão 1 – Interpretação de Texto
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 6, 20,
        'A Língua da Tabatinga, falada na cidade de Bom Despacho, Minas Gerais, foi por muito tempo estigmatizada devido à sua origem e à própria classe social de seus falantes, pois, segundo uma pesquisadora, era falada por "meninos pobres vindos da Tabatinga ou de Cruz de Monte — ruas da periferia da cidade cujos habitantes sempre foram tidos por marginais". Conhecida por antigos como a "língua dos engraxates", pois muitos trabalhadores desse ofício conversavam nessa língua enquanto lustravam sapatos na praça da matriz, a Língua da Tabatinga era utilizada por negros escravizados como uma espécie de "língua secreta", um código para trocarem informações de como conseguir alimentos, ou para planejar fugas de seus senhores sem risco de serem descobertos por eles. De acordo com um documento do Iphan (2011), os falantes da língua apresentam uma forte consciência de sua relação com a descendência africana e da importância de preservar a "fala que os identifica na região". Essa mudança de compreensão tangencia aspectos de pertencimento, pois, à medida que o falante da Língua da Tabatinga se identifica com a origem afro-brasileira, ele passa a ver essa língua como um legado recebido e tem o cuidado de transmiti-la para outras gerações. A concentração de falantes dessa língua está na faixa entre 21 e 60 anos de idade. Disponível em: www.historiaeparcerias2019.rj.anpuh.org. Acesso em: 3 fev. 2024 (adaptado). A Língua da Tabatinga tem sido preservada porque o(a)',
        2);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'seu registro passou da forma oral para a escrita.', false),
       (currval('questions_id_seq'), 'B', 'classe social de seus usuários ganhou prestígio.', false),
       (currval('questions_id_seq'), 'C', 'sua função inicial se manteve ao longo dos anos.', false),
       (currval('questions_id_seq'), 'D', 'sentimento de identidade linguística tem se consolidado.', true),
       (currval('questions_id_seq'), 'E', 'perfil etário de seus falantes tem se tornado homogêneo.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 6, 19,
        'Diante do pouco dinheiro para produtos básicos de sobrevivência, são as adolescentes o alvo mais vulnerável à precariedade menstrual. Sofrem com dois fatores: o desconhecimento da importância da higiene menstrual para sua saúde e a dependência dos pais ou familiares para a compra do absorvente, que acaba entrando na lista de artigos supérfluos da casa. A falta do absorvente afeta diretamente o desempenho escolar dessas estudantes e, como consequência, restringe o desenvolvimento de seu potencial na vida adulta. Dados da Pesquisa Nacional de Saúde (PNS), do IBGE, revelaram que, das meninas entre 10 e 19 anos que deixaram de fazer alguma atividade (estudar, realizar afazeres domésticos, trabalhar ou, até mesmo, brincar) por problemas de saúde nos 14 dias anteriores à data de pesquisa, 2,88% deixaram de fazê-la por problemas menstruais. Para efeitos de comparação, o índice de meninas que relataram não ter conseguido realizar alguma de suas atividades por gravidez e parto foi menor: 2,55%. Dados da ONU apontam que, no mundo, uma em cada dez meninas falta às aulas durante o período menstrual. No Brasil, esse número é ainda maior: uma entre quatro estudantes já deixou de ir à escola por não ter absorventes. Com isso, perdem, em média, até 45 dias de aula, por ano letivo, como revela o levantamento Impacto da Pobreza Menstrual no Brasil. O ato biológico de menstruar acaba por virar mais um fator de desigualdade de oportunidades entre os gêneros. Disponível em: www12.senado.org.br Acesso em: 21 jan. 2024 (adaptado). Esse texto é marcado pela função referencial da linguagem, uma vez que cumpre o propósito de',
        2);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'sugerir soluções para um problema de ordem social.', false),
       (currval('questions_id_seq'), 'B', 'estabelecer uma relação entre menstruação e gravidez.', false),
       (currval('questions_id_seq'), 'C', 'comparar o desempenho acadêmico de mulheres e homens.', false),
       (currval('questions_id_seq'), 'D',
        'informar o leitor sobre o impacto da pobreza menstrual na vida das mulheres.', true),
       (currval('questions_id_seq'), 'E',
        'orientar o público sobre a necessidade de rotinas de autocuidado na adolescência.', false);

-- Questão 3 – Gramática
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 8, 25,
        'Maranhenses que moram longe matam a saudade da terra natal usando expressões próprias do estado. Se o maranhês impressiona e desperta a curiosidade de quem mora no próprio Maranhão, imagine de quem vem de outros estados e países? A variedade linguística local é enorme e o modo de falar tão próprio e característico dos maranhenses vem conquistando muita gente e inspirando títulos e muito conteúdo digital com a criação de podcasts, blogs, perfis na internet, além de estampar diversos tipos de produtos e serviços de empresas locais. Com saudades do Maranhão, morando há 16 anos no Rio de Janeiro, um fotógrafo maranhense criou um perfil na internet no qual compartilha a culinária, brincadeiras e o ''dicionário'' maranhês. "A primeira vez que fui a uma padaria no Rio, na inocência, pedi 3 reais de ''pães misturados''. Quando falei isso, as pessoas pararam e me olharam de uma forma bem engraçada, aí já fiquei ''encabulado, ó'' e o atendente sorriu e explicou que lá não existia pão misturado e, sim, pão francês e suíço. Depois foi a minha vez de explicar sobre os pães ''massa grossa e massa fina''", contou o fotógrafo, com humor. Disponível em: https://oimparcial.com.br. Acesso em: 1 nov. 2021 (adaptado). A vivência relatada no texto evidencia que as variedades linguísticas',
        5);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'impedem o entendimento mútuo.', false),
       (currval('questions_id_seq'), 'B', 'enaltecem o português do Maranhão.', false),
       (currval('questions_id_seq'), 'C', 'são constitutivas do português brasileiro.', true),
       (currval('questions_id_seq'), 'D', 'exigem a dicionarização dos termos usados.', false),
       (currval('questions_id_seq'), 'E', 'são restritas a situações coloquiais de comunicação.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 9, 30,
        'Telemedicina é para todos, mas nem todos estão preparados A telemedicina, nos últimos anos, tem se destacado como uma ferramenta valiosa, proporcionando uma gama de benefícios que vão desde a ampliação do acesso à assistência médica até a otimização dos recursos de todo o ecossistema de saúde. O governo federal propõe a Estratégia de Saúde Digital, um programa destinado à transformação digital da saúde no Brasil. Seu principal objetivo é facilitar a troca de informações entre os diversos pontos da Rede de Atenção à Saúde, promovendo a interoperabilidade e, assim, possibilitando a transição e a continuidade do cuidado nos setores público e privado. Também está em discussão um projeto de lei que dispõe sobre o prontuário eletrônico unificado do cidadão, o que indica o quanto o tema está em evidência tanto para os gestores públicos quanto para os privados. Contudo, é importante reconhecer que nem todas as pessoas estão igualmente preparadas para aproveitar plenamente os cuidados ofertados pela telemedicina. Um dos principais benefícios do atendimento de saúde a distância é a capacidade de superar barreiras geográficas, proporcionando acesso a serviços médicos, especialmente para pacientes que residem em áreas remotas e/ou carentes de certas especialidades médicas, os chamados “vazios assistenciais”. A equidade no acesso é uma questão crítica, uma vez que nem todos têm ao seu alcance dispositivos tecnológicos ou uma conexão à internet que seja confiável, entre outros problemas de infraestrutura. É um desafio tanto para os pacientes quanto para os profissionais de saúde, que, em muitos casos, não contam com estrutura para o trabalho remoto nem com letramento digital para desenvolver as funções. OLIVEIRA, D. Disponível em: www.correiobraziliense.com.br. Acesso em: 21 jan. 2024 (adaptado). Ao tratar da telemedicina, esse texto ressalta que um dos benefícios dessa tecnologia para a sociedade é o fato de ela',
        4);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A',
        'disponibilizar prontuário único do cidadão tanto na rede pública quanto na privada.', false),
       (currval('questions_id_seq'), 'B', 'oportunizar o acesso a atendimento médico a pacientes de áreas periféricas.',
        true),
       (currval('questions_id_seq'), 'C', 'fornecer dispositivos tecnológicos para a realização de exames.', false),
       (currval('questions_id_seq'), 'D', 'promover a interação entre diferentes especialidades médicas.', false),
       (currval('questions_id_seq'), 'E', 'garantir infraestrutura para o trabalho remoto de médicos.', false);

-- Questão 5 – Interpretação de Texto
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 4, 13,
        'Uma definição possível para o conceito de arte afro-brasileira pode ser: produção plástica que é feita por negros, mestiços ou brancos a partir de suas experiências com a cultura negra nacional. Exemplos clássicos dessa abordagem são Carybé (1911-1997), Mestre Didi (1917-2013) e Djanira da Motta e Silva (1914-1979), cujas obras emergem e ganham forma em razão do ambiente social no qual habitaram e viveram. Se Didi era um célebre representante da cultura religiosa nagô baiana e brasileira, iniciado desde o ventre no candomblé, Carybé era argentino e, naturalizado brasileiro, envolveu-se de tal modo com essa religião que alguns dos orixás do quais conhecemos a imagem visual são produções suas. Disponível em: www.premiopipa.com. Acesso em: 13 nov. 2021 (adaptado) Sob a perspectiva da multiculturalidade e de acordo com o texto, a produção artística afro-brasileira carcteriza-se pelo(a)',
        3);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A',
        'estranhamento no modo de apropriação da cultura religiosa de matriz africana.', false),
       (currval('questions_id_seq'), 'B',
        'distanciamento entre as raízes de matriz africana e a estética de outras culturas.', false),
       (currval('questions_id_seq'), 'C',
        'visão uniformizadora das religiões de matriz africana expressada nas diferentes produções.', false),
       (currval('questions_id_seq'), 'D',
        'relação complexa entre as vivências pessoais dos artistas e os referenciais estéticos de matriz africana.',
        true),
       (currval('questions_id_seq'), 'E',
        'padronização da forma de produção e da temática da matriz africana presente nas obras dos artistas citados.',
        false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 7, 23,
        'Influenciadores negros têm recorrentemente chamado a atenção para o fato de terem muito menos repercussão em suas postagens e nas entregas de seu conteúdo quando comparados com os influenciadores brancos, mesmo se fotos, contextos e anúncios forem extremamente semelhantes. Segundo o site Negrê, a digital influencer e youtuber criadora do projeto digital Preta Pariu iniciou um experimento em uma plataforma. Após perceber a crescente queda nos índices de alcance digital, a paulista publicou fotografias de modelos brancas em seu perfil e analisou as métricas de engajamento. Surpreendentemente, a ferramenta de estatísticas aferiu um aumento de 6.000% em seu alcance. Disponível em: http://diplomatique.org.br . Acesso em: 21 jan. 2024 (adaptado). A apresentação do dado estatístico ao final desse texto revela a intenção de',
        2);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'demonstrar a repercussão de projetos como o Preta Pariu.', false),
       (currval('questions_id_seq'), 'B', 'informar o quantitativo de postagens da comunidade negra.', false),
       (currval('questions_id_seq'), 'C', 'potencializar o alcance de textos e imagens em sites como o Negrê.', false),
       (currval('questions_id_seq'), 'D', 'exaltar a qualidade das publicações sobre negritude em redes sociais.',
        false),
       (currval('questions_id_seq'), 'E', 'comprovar a relação entre o alcance de conteúdos digitais e o viés racial.',
        true);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 3, 10,
        'Um estudo norte-americano analisou os efeitos da pandemia da covid-19 sobre a saúde mental e a manutenção da atividade física, revelando que um fator está diretamente ligado ao outro. De acordo com os dados, famílias de baixa renda foram mais impactadas pelo ciclo vicioso de falta de motivação e pelo sedentarismo. Diante da necessidade de distanciamento social e do início da quarentena, as opções de espaços seguros para exercícios físicos diminuíram, o que dificultou que as pessoas mantivessem seus níveis de atividade. Os dados evidenciaram que as pessoas mais ativas tinham melhor estado de saúde mental. As pessoas com menor renda tiveram mais dificuldade para manter os níveis de atividade física durante a pandemia, sendo aproximadamente duas vezes menos propensas a continuarem no mesmo ritmo de exercícios de antes da pandemia. Habitantes de áreas urbanas mostraram maior probabilidade de não conseguirem manter os níveis de atividade física semelhantes aos de pessoas que vivem em zonas rurais, onde há mais oportunidades de sair para espaços abertos. Disponível em: https://revistagalileu.globo.com. Acesso em: 6 dez. 2021 (adaptado). O texto evidencia a perspectiva ampliada de saúde ao abordar criticamente a pandemia da covid-19 a partir do(a)',
        6);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'busca por espaços para a prática de exercícios físicos.', false),
       (currval('questions_id_seq'), 'B', 'necessidade de se manter ativo para ter equilíbrio emocional.', false),
       (currval('questions_id_seq'), 'C', 'distanciamento social e sua vinculação com a prática de atividades físicas.',
        false),
       (currval('questions_id_seq'), 'D', 'relação entre os determinantes socioeconômicos e a prática de exercícios.',
        true),
       (currval('questions_id_seq'), 'E',
        'benefício de morar em áreas rurais para preservar a estabilidade psicológica.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 5, 15,
        'Até ali que sabia das misérias do mundo? Nada. Aquela noite do Castelo, tão simples, tão monótona, fora uma revelação! Era bem certo que a lágrima existia, que irrompiam soluços de peitos oprimidos, que para alguém os dias não tinham cor nem a noite tinha estrelas! Ela, criada entre beijos, no aroma dos seus jardins, com as vontades satisfeitas, o leito fofo, a mesa delicada, sentira sempre no coração um desejo sem nome, um desejo ou uma saudade absurda, a saudade do céu, como dizia o dr. Gervásio, e que não era mais que a doida aspiração da artista incipiente, que germinava no seu peito fraco. E aquela mesma mágoa parecia-lhe agora doce e embaladora, comparando-se à outra, a Sancha, da sua idade, negra, feia, suja, levada a pontapés, dormindo sem lençóis em uma esteira, comendo em pé, apressada, os restos parcos e frios de duas velhas, vestida de algodões rotos, curvada para um trabalho sem descanso nem paga! Por quê? Que direito teriam uns a todas as primícias e regalos da vida, se havia outros que nem por uma nesga viam a felicidade? ALMEIDA, J. L. A falência . Disponível em: www.dominiopublico.gov.br. Acesso em: 28 dez. 2023. Nesse fragmento do romance de Júlia Lopes de Almeida, escrito no cenário brasileiro pós-abolição, a narradora exprime um olhar crítico sobre a',
        4);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'desvalorização da arte produzida por mulheres.', false),
       (currval('questions_id_seq'), 'B', 'mudança das condições de moradia do povo negro.', false),
       (currval('questions_id_seq'), 'C', 'ruptura do projeto político de emancipação feminina.', false),
       (currval('questions_id_seq'), 'D', 'exploração da força de trabalho da população negra.', true),
       (currval('questions_id_seq'), 'E', 'disputa de poder entre brancos e negros no século XIX.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 6, 18,
        'Sempre passo nervoso quando leio minha crônica neste jornal e percebo que escapuliu a palavra "coisa" em alguma frase. Acontece que "coisa" está entre as coisas mais deliciosas do mundo. O primeiro banho da minha filha foi embalado pela minha voz dizendo, ao fundo, "cuidado, ela ainda é uma coisinha tão pequena". "Viu só que amor? Nunca vi coisa assim". O amor que não dá conta de explicação é "a coisa" em seu esplendor e excelência. "Alguma coisa acontece no meu coração" é a frase mais bonita que alguém já disse sobre São Paulo. E quando Caetano, citado aqui pela terceira vez pra defender a dimensão poética da coisa, diz "coisa linda", nós sabemos que nenhuma palavra definiria de forma mais profunda e literária o quão bela e amada uma coisa pode ser. "Coisar" é verbo de quem está com pressa ou tem lapsos de memória. É pra quando "mexe qualquer coisa dentro doida". E que coisa magnífica poder se expressar tal qual Caetano Veloso. Agora chega, porque "esse papo já tá qualquer coisa" e eu já tô "pra lá de Marrakech". TATI BERNARDI. Disponível em: www1.folha.uol.com.br. Acesso em: 3 jan. 2024 (adaptado). O recurso utilizado na progressão textual para garantir a unidade temática dessa crônica é a',
        1);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'intertextualidade, marcada pela citação de versos de letras de canções.',
        false),
       (currval('questions_id_seq'), 'B',
        'metalinguagem, marcada pela referência à sua escrita de crônicas pela autora.', false),
       (currval('questions_id_seq'), 'C',
        'reiteração, marcada pela repetição de uma determinada palavra e de seus cognatos.', true),
       (currval('questions_id_seq'), 'D',
        'conexão, marcada pela presença dos conectores lógicos "quando" e "porque" entre orações.', false),
       (currval('questions_id_seq'), 'E',
        'pronominalização, marcada pela retomada de "minha filha" e "um namorado ruim" pelos pronomes "ela" e "lo".',
        false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 3, 11,
        'Por trás do universo “masculino” das lutas, é cada vez mais notório o aumento da participação de mulheres nessa prática corporal. Algumas situações reforçam esse fenômeno de ocupação em ambientes de lutas: a inclusão de mulheres em combates de artes marciais mistas, ou MMA, a transmissão televisiva de lutas de mulheres e a criação de horários específicos para elas em academias que ensinam lutas. Uma pesquisa científica mostrou menor participação e mobilização das meninas em comparação com os meninos nas aulas de Educação Física. Entre as justificativas discentes para essa situação está o fato de que eles relacionam a luta como uma expressão corporal masculina e, por consequência, não adequada aos interesses femininos. Dessa forma, o ensino de lutas nas aulas de Educação Física é atravessado por tensões relacionadas às questões de gênero e sexualidade, o que, por sua vez, pode favorecer a sua exclusão do conteúdo próprio da disciplina. SO, M. R.; MARTINS, M. Z.; BETTI, M. As relações das meninas com os saberes das lutas nas aulas de Educação Física. Motrivivência , n. 56, dez. 2018 (adaptado) Segundo o texto, apesar do aumento da participação de mulheres em lutas, a realidade na escola ainda é diferente em razão do(a)',
        1);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'esportivização desse conteúdo.', false),
       (currval('questions_id_seq'), 'B', 'masculinização dessa modalidade.', true),
       (currval('questions_id_seq'), 'C', 'enfoque desses eventos pela mídia.', false),
       (currval('questions_id_seq'), 'D', 'trato pedagógico dessa manifestação.', false),
       (currval('questions_id_seq'), 'E', 'marginalização desse tema pela Educação Física.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 1, 1,
        'As reações à sétima temporada foram o ápice do último estágio em Game of Thrones . De forma alguma, este que vos fala seria capaz de argumentar que a série é perfeita, mas os defeitos que existem aqui sempre existiram, de uma forma ou de outra, durante os sete anos em que ela esteve no ar. Os dois roteiristas foram brilhantes em traduzir os personagens intrincados e conflituosos da obra de George R. R. Martin, mas nunca souberam exatamente como fazer jus a ele (e especialmente a elas, as mulheres da trama). A verdade é que, com tudo isso e mais Ramin Djawadi evocando sentimentos e ambientes improváveis com sua trilha sonora magistral, a série não conseguiria ser ruim nem se tentasse, mas continua sendo uma pena que, ao buscar o seu final com tanta sede e tanta celebridade, Benioff e Weiss tenham tirado sua qualidade mais preciosa: o fôlego, a paciência e o detalhismo que faziam suas palavras se levantarem do papel e ganharem vida. Disponível em: https://observatoriodocinema.uol.com.br. Acesso em: 29 nov. 2017 (adaptado). Ainda que faça uma avaliação positiva da série, nessa resenha, o autor aponta aspectos negativos da obra ao utilizar',
        4);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'marcas de impessoalidade que disfarçam a opinião do especialista.', false),
       (currval('questions_id_seq'), 'B', 'expressões adversativas para fazer ressalvas às afirmações elogiosas.',
        true),
       (currval('questions_id_seq'), 'C', 'interlocução com o leitor para corroborar opiniões contrárias à adaptação.',
        false),
       (currval('questions_id_seq'), 'D', 'eufemismos que minimizam as críticas feitas à construção das personagens.',
        false),
       (currval('questions_id_seq'), 'E',
        'antíteses que opõem a fragilidade do roteiro à beleza da trilha sonora da série.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 7, 24,
        'Volta e meia recebo cartinhas de fãs, e alguns são bem jovens, contando como meu trabalho com a música mudou a vida deles. Fico no céu lendo essas coisas e me emociono quando escrevem que não são aceitos pelos pais por serem diferentes, e como minhas músicas são uma companhia e os libertam nessas horas de solidão. Sinto que é mais complicado ser jovem hoje, já que nunca tivemos essa superpopulação no planeta: haja competitividade, culto à beleza, ter filho ou não, estudar, ralar para arranjar trabalho, ser mal remunerado, ser bombardeado com trocentas informações, lavagens cerebrais... Queria dar beijinhos e carinhos sem ter fim nessa moçada e dizer a ela que a barra é pesada mesmo, mas que a juventude está a seu favor e, de repente, a maré de tempestade muda. Diria também um monte de clichê: que vale a pena estudar mais, pesquisar mais, ler mais. Diria que não é sinal de saúde estar bem-adaptado a uma sociedade doente, que o que é normal para uma aranha é o caos para uma mosca. Meninada, sintam-se beijados pela vovó Rita. RITA LEE. Outra autobiografia . São Paulo: Globo Livros, 2023. Como estratégia para se aproximar de seu leitor, a autora usa uma postura de empatia explicitada em',
        3);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', '"Volta e meia recebo cartinhas de fãs, e alguns são bem jovens".', false),
       (currval('questions_id_seq'), 'B', '"Fico no céu lendo essas coisas".', false),
       (currval('questions_id_seq'), 'C', '"Sinto que é mais complicado ser jovem hoje".', true),
       (currval('questions_id_seq'), 'D', '"Queria dar beijinhos e carinhos sem ter fim nessa moçada".', false),
       (currval('questions_id_seq'), 'E', '"Diria que não é sinal de saúde estar bem-adaptado a uma sociedade doente".',
        false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 6, 18,
        'Data venia Conheci Bentinho e Capitu nos meus curiosos e antigos quinze anos. E os olhos de água da jovem de Matacavalos atraíram-me, seduziram-me ao primeiro contato. Aliados ao seu jeito de ser, flor e mistério. Mas tornou-me também a indignação diante do narrador e seu texto, feito de acusações e vilipêndio. Sem qualquer direito de defesa. Sem acesso ao discurso, usurpado, sutilmente, pela palavra autoritária do marido, algoz, em pele de cordeiro vitimado. Crudelíssimo e desumano: não bastasse o que faz com a mulher, chega a desejar a morte do próprio filho e a festejá-la com um jantar, sem qualquer remorso. No fundo, uma pobre consciência dilacerada, um homem dividido, que busca encontrar-se na memória, e acaba faltando-se a si mesmo. Retomei inúmeras vezes a triste história daquele amor em desencanto. Familiarizei-me, ao longo do tempo, com a crítica do texto; poucos, muitos poucos, escapam das bem traçadas linhas do libelo condenatório; no mínimo concedem à ré o beneplácito da dúvida: convertem-na num enigma indecifrável, seu atributo consagrador. Eis que, diante de mais um retorno ao romance, veio a iluminação: por que não dar a voz plena àquela mulher, brasileira do século XIX, que, apesar de todas as artimanhas e do maquiavelismo do companheiro, se converte numa das mais fascinantes criaturas do gênio que foi Machado de Assis? A empresa era temerária, mas escrever é sempre um risco. Apoiado no espaço de liberdade em que habita a Literatura, arrisquei-me. O resultado: este livro em que, além-túmulo, como Brás Cubas, a dona dos olhos de ressaca assume, à luz do mistério da arte literária e do próprio texto do Dr. Bento Santiago, seu discurso e sua verdade. PROENÇA FILHO, D. Capitu: memórias póstumas . Rio de Janeiro: Atrium, 1998. Para apresentar a apropriação literária que faz a obra de Machado de Assis, o autor desse texto',
        8);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A',
        'relaciona aspectos centrais da obra original e, então, reafirma o ponto de vista adotado.', false),
       (currval('questions_id_seq'), 'B',
        'explica os pontos de vista de críticos da literatura e, por fim, os redimensiona na discussão.', false),
       (currval('questions_id_seq'), 'C',
        'introduz elementos relevantes da história e, na sequência, apresenta motivos para refutá-los.', false),
       (currval('questions_id_seq'), 'D',
        'justifica as razões pelas quais adotou certa abordagem e, em seguida, reconsidera tal escolha.', false),
       (currval('questions_id_seq'), 'E',
        'contextualiza o enredo de forma subjetiva e, na conclusão, explicita o foco narrativo a ser assumido.', true);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 5, 17,
        'Meu irmão é filho adotivo. Há uma tecnicidade no termo, filho adotivo, que contribui para sua aceitação social. Há uma novidade que por um átimo o absolve das mazelas do passado, que parece limpá-lo de seus sentidos indesejáveis. Digo que meu irmão é filho adotivo e as pessoas tendem a assentir com solenidade, disfarçando qualquer pesar, baixando os olhos como se não sentissem nenhuma ânsia de perguntar mais nada. Talvez compartilhem da minha inquietude, talvez de fato se esqueçam do assunto no próximo gole ou na próxima garfada. Se a inquietude continua a reverberar em mim, é porque ouço a frase também de maneira parcial — meu irmão é filho — e é difícil aceitar que ela não termine com a verdade tautológica habitual: meu irmão é filho dos meus pais. Estou entoando que meu irmão é filho e uma interrogação sempre me salta aos lábios: filho de quem? FUCKS, J. A resistência. São Paulo: Cia. das Letras, 2015. Das reflexões do narrador, apreende-se uma perspectiva que associa a adoção',
        4);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A',
        'a representações sociais estigmatizadas da parentalidade. representações sociais estigmatizadas da parentalidade. inquietações próprias das relações entre irmãos.',
        true),
       (currval('questions_id_seq'), 'B', 'à necessidade de aprovação por parte de desconhecidos.', false),
       (currval('questions_id_seq'), 'C', 'ao julgamento velado de membros do núcleo familiar.', false),
       (currval('questions_id_seq'), 'D', 'ao conflito entre o termo técnico e o vínculo afetivo.', false),
       (currval('questions_id_seq'), 'E', 'a inquietações próprias das relações entre irmãos.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 7, 22,
        'Cap. XLVIII / Terpsícore - Ao contrário do que ficou dito atrás, Flora não se aborreceu na ilha. Conjeturei mal, emendo-me a tempo. Podia aborrecer-se pelas razões que lá ficam, e ainda outras que poupei ao leitor apressado; mas, em verdade, passou bem a noite. A novidade da festa, a vizinhança do mar, os navios perdidos na sombra, a cidade defronte com os seus lampiões de gás, embaixo e em cima, na praia e nos outeiros, eis aí aspectos novos que a encantaram durante aquelas horas rápidas. Não lhe faltavam pares, nem conversação, nem alegria alheia e própria. Toda ela compartia da felicidade dos outros. Via, ouvia, sorria, esquecia-se do resto para se meter consigo. Também invejava a princesa imperial, que viria a ser imperatriz um dia, com o absoluto poder de despedir ministros e damas, visitas e requerentes, e ficar só, no mais recôndito do paço, fartando-se de contemplação ou de música. Era assim que Flora definia o ofício de governar. Tais ideias passavam e tornavam. De uma vez alguém lhe disse, como para lhe dar força: “Toda alma livre é imperatriz.” ASSIS, M. Esaú e Jacó. Rio de Janeiro: Nova Aguilar, 1974. Convidada para o último baile do Império, na Ilha Fiscal, localizada no Rio de Janeiro, Flora devaneia sobre aspectos daquele contexto, no qual o narrador ironiza a',
        6);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'promessa de esperança com o futuro regime.', false),
       (currval('questions_id_seq'), 'B', 'alienação da elite em relação ao fim da monarquia.', true),
       (currval('questions_id_seq'), 'C', 'perspectiva da contemplação distanciada da capital.', false),
       (currval('questions_id_seq'), 'D', 'animosidade entre população e membros da nobreza.', false),
       (currval('questions_id_seq'), 'E', 'fantasia de amor e de casamento da mulher burguesa.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 5, 16,
        'Tomo café em golinhos para não queimar meus lábios ressequidos. Como pão em pedacinhos para não engasgar com um farelo mais duro. Marília come também, mas olha o tempo todo para baixo. Parece que tem um acanhamento novo entre a gente. Termino. Olho mais uma vez pela janela. O dia está bom. Quero caminhar pelo pátio. Marília levanta, pega o andador e põe ao lado da cama. Ela sabe que eu quero levantar sozinha, e levanto. O lance de escadas, apesar de pequeno, ainda me causa problemas, mas não quero um elevador na casa e não vou tolerar descer uma rampa de cadeira de rodas. Marília abre a porta e saímos para a manhã. O dia está mais fresco do que eu imaginava. Ela pega uma manta de tricô que temos desde não sei quando e põe sobre as minhas costas. Ela aperta meus ombros com muita força, porque mesmo depois de todos esses anos, não descobriu a medida certa do carinho. Eu gosto. Porque entendo que naquele ato, naquela força está o nosso carinho. POLESSO, N. B. Amora . Porto Alegre: Não Editora, 2015. Nesse trecho, o drama do declínio físico da narradora transmite uma sensibilidade lírica centrada na',
        6);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'necessidade de fazer adaptações na casa.', false),
       (currval('questions_id_seq'), 'B', 'atmosfera de afeto fortalecido pelo convívio.', true),
       (currval('questions_id_seq'), 'C', 'condição de dependência de outras pessoas.', false),
       (currval('questions_id_seq'), 'D', 'determinação de manter a regularidade da rotina.', false),
       (currval('questions_id_seq'), 'E', 'aceitação das restrições de mobilidade da personagem.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 9, 28,
        'Em novembro de 2023, uma professora indígena recebeu uma missão: verter as regras de um jogo de tabuleiro infantil do português para o tukano, sua língua nativa. Com vinte anos de experiência como professora de línguas em Taracuá, no Amazonas, ela já se dedicava à tradução havia tempos. O trabalho ficou mais fácil graças a um aplicativo lançado no ano anterior: com o Linklado em seu computador, ela traduziu as sete páginas das instruções do jogo em dois dias. Sem esse recurso, a tarefa seria bem mais trabalhosa. Antes dele, diz a professora, as transcrições de línguas indígenas exigiam o esforço quase manual de produzir diacríticos (acentos gráficos) e letras que não constam no teclado de aplicativos de mensagens ou programas de texto. Para a pesquisadora do Instituto Nacional de Pesquisas da Amazônia (Inpa), idealizadora do aplicativo, o Linklado representa uma revolução. O programa não restringe combinações de acentos, e isso poderá facilitar a criação de representações gráficas para fonemas que ainda não têm forma escrita. "Eu mirei em uma dor e atingimos várias outras", diz. "O Linklado possibilita que o Brasil reconheça a sua diversidade linguística", afirma uma antropóloga que é colega da pesquisadora no Inpa e faz parte da equipe do aplicativo. Ela defende que escrever na língua materna é uma das principais formas de preservá-la. Disponível em: http://piaui.folha.uol.com.br. Acesso em: 3 fev. 2024 (adaptado). De acordo com esse texto, o aplicativo Linklado contribuiu para a',
        6);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'criação de fonemas representativos de línguas indígenas no meio digital.',
        false),
       (currval('questions_id_seq'), 'B', 'democratização do registro escrito de línguas dos povos originários.', true),
       (currval('questions_id_seq'), 'C', 'adaptação de regras de jogos de tabuleiro de origem indígena.', false),
       (currval('questions_id_seq'), 'D', 'divulgação das técnicas de tradução de línguas indígenas.', false),
       (currval('questions_id_seq'), 'E', 'aprendizagem da língua portuguesa pelos indígenas.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 6, 18,
        'Se você é feito de música, este texto é pra você Às vezes, no silêncio da noite, eu fico imaginando: que graça teria a vida sem música? Sem ela não há paz, não há beleza. Nos dias de festa e nas madrugadas de pranto, nas trilhas dos filmes e nas corridas no parque, o que seria de nós sem as canções que enfeitam o cotidiano com ritmo e verso? Quem nunca curou uma dor de cotovelo dançando lambada ou terminou de se afundar ouvindo sertanejo sofrência? Quantos já criticaram funk e fecharam a noite descendo até o chão? Tudo bem... Raul nos ensinou que é preferível ser essa metamorfose ambulante do que ter aquela velha opinião formada sobre tudo. Já somos castigados com o peso das tragédias, o barulho das buzinas, os ruídos dos conflitos. É pau, é pedra, é o fim do caminho. Há uma nuvem de lágrimas sobre os olhos, você está na lanterna dos afogados, o coração despedaçado. Mas, como um sopro, da janela do vizinho, entra o samba que reanima a mente. Floresce do fundo do nosso quintal a batida que ressuscita o ânimo, sintoniza a alegria e equaliza o fôlego. Levanta, sacode a poeira, dá a volta por cima. BITTAR, L. Disponível em: www.revistabula.com. Acesso em: 21 nov. 2021 (adaptado). Defendendo a importância da música para o bem-estar e o equilíbrio emocional das pessoas, a autora usa, como recurso persuasivo, a',
        4);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'contradição, ao associar o coração despedaçado à alegria.', false),
       (currval('questions_id_seq'), 'B', 'metáfora, ao citar a imagem da metamorfose ambulante.', false),
       (currval('questions_id_seq'), 'C', 'intertextualidade, ao resgatar versos de letras de canções.', true),
       (currval('questions_id_seq'), 'D', 'enumeração, ao mencionar diferentes ritmos musicais.', false),
       (currval('questions_id_seq'), 'E', 'hipérbole, ao falar em "sofrência", "tragédias" e "afogados".', false);


INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 5, 17,
        'pessoas com suas malas mochilas e valises chegam e se vão se encontram se despedem e se despem de seus pertences como se pudessem chegar a algum lugar onde elas mesmas não estivessem RUIZ, A. In: SANT''ANNA, A. Rua Aribau: coletânea de poemas . Porto Alegre: TAG, 2018. Esse poema, por meio da ideia de deslocamento, metaforiza a tentativa de pessoas',
        3);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'buscarem novos encontros.', false),
       (currval('questions_id_seq'), 'B', 'fugirem da própria identidade.', true),
       (currval('questions_id_seq'), 'C', 'procurarem lugares inexplorados.', false),
       (currval('questions_id_seq'), 'D', 'partirem em experiências inusitadas.', false),
       (currval('questions_id_seq'), 'E', 'desaparecerem da vida em sociedade.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 8, 27,
        'Falar errado é uma arte, Arnesto! No dia 6 de agosto de 1910, Emma Riccini Rubinato pariu um garoto sapeca em Valinhos e deu a ele o nome de João Rubinato. Na escola, João não passou do terceiro ano. Não era a área dele, tinha de escolher outra. Fez o que apareceu. Foi ser garçom, metalúrgico, até virar radialista, comediante, ator de cinema e TV, cantor e compositor. De samba. Como tinha sobrenome italiano, João resolveu mudar para emplacar seu samba. E como ia mudar o sobrenome, mudou o nome. Virou Adoniran Barbosa. O cara falava errado, voz rouca, pinta de malandro da roça. Virou ícone da música brasileira, o mais paulista de todos, falando errado e irritando Vinicius de Moraes, que ficou de bico fechado depois de ouvir a música que Adoniran fez para a letra Bom dia, tristeza , de autoria do Poetinha. Coisa de arrepiar. Para toda essa gente que implicava, Adoniran tinha uma resposta neoerudita: “Gosto de samba e não é fácil, pra mim, ser aceito como compositor, porque ninguém queria nada com as minhas letras que falavam ‘nóis vai’, ‘nóis fumo’, ‘nóis fizemo’, ‘nóis peguemo’. Acontece que é preciso saber falar errado. Falar errado é uma arte, senão vira deboche.” Ele sabia o que fazia. Por isso dizia que falar errado era uma arte. A sua arte. Escolhida a dedo porque casava com seu tipo. O Samba do Arnesto é um monumento à fala errada, assim como Tiro ao Álvaro . O erudito podia resmungar, mas o povo se identificava. PEREIRA, E. Disponível em: www.tribunapr.com.br. Acesso em: 8 jul. 2024 (adaptado). O “falar errado” a que o texto se refere constitui um preconceito em relação ao uso que Adoniran Barbosa fazia da língua em suas composições, pois esse uso',
        3);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'marcava a linguagem dos comediantes no mesmo período.', false),
       (currval('questions_id_seq'), 'B', 'prejudicava a compreensão das canções pelo público.', false),
       (currval('questions_id_seq'), 'C', 'denunciava a ausência de estilo nas letras de canção.', false),
       (currval('questions_id_seq'), 'D', 'restringia a criação poética nas letras do compositor.', false),
       (currval('questions_id_seq'), 'E', 'transgredia a norma-padrão vigente à época.', true);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 3, 9,
        'O festival folclórico de Parintins, no Amazonas, anunciou que o Boi Caprichoso levou, em 2018, seu 23º título — contra 31 do adversário Boi Garantido. Desde o fim do evento que não paro de cantar duas músicas que aprendi no Bumbódromo (arena onde ocorre o espetáculo). Revezo entre “ meu amor, eu sou feliz, ééé azul o meu país ”, obviamente do boi azul, o Caprichoso; e “ vermelhou o curral, a ideologia avermelhou ”, do boi vermelho, o Garantido. Esse revezamento seria proibido em Parintins, cidade tão dividida entre as torcidas dos bois. Em Parintins, você tem de ter um lado. Há aqueles que tentam fugir e dizem que são “garanchoso”, com os quais me identifiquei, mas esses são vistos com certo desdém. DYNEWICZ, L. Disponível em: https://viagem.estadao.com.br . Acesso em: 22 nov. 2018 (adaptado). A apropriação de elementos como rivalidade, competitividade, torcida e gritos de guerra pelo festival de Parintins evidencia a',
        4);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'escolha de um local específico para a festa.', false),
       (currval('questions_id_seq'), 'B', 'prejudicava a compreensão das canções pelo público.', false),
       (currval('questions_id_seq'), 'C', 'denunciava a ausência de estilo nas letras de canção.', false),
       (currval('questions_id_seq'), 'D', 'restringia a criação poética nas letras do compositor.', false),
       (currval('questions_id_seq'), 'E', 'transgredia a norma-padrão vigente à época.', true);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 1, 2,
        'O Brasil somou cerca de 60 mil novos casos de câncer de mama até o final de 2019, número que corresponde a 25% de todos os diagnósticos da condição registrados no país, segundo dados do Instituto Nacional do Câncer (Inca). Apesar de o Outubro Rosa ser o mês de conscientização sobre a questão voltada para as mulheres, é muito importante lembrar que um dos grandes mitos da medicina é o de que o câncer de mama não afeta o sexo masculino. Fatores importantes para detectar o câncer de mama masculino: 1. Genética: se houver casos na família, as chances são um pouco mais elevadas. 2. Hormônios: homens podem desenvolver tecido real das glândulas mamárias por tomarem certos medicamentos ou apresentarem níveis hormonais anormais. 3. Caroços: é necessário que os médicos se atentem a alguns sintomas suspeitos, como um caroço na área do tórax. 4. Retração na pele: em situações mais graves do câncer de mama masculino, é possível também ocorrer uma retração do mamilo. Disponível em: https://pebmed.com.br. Acesso em: 24 nov. 2021 (adaptado). As informações dessa reportagem auxiliam no combate ao câncer de mama masculino por apresentarem um alerta sobre o(s)',
        2);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'sinais indicadores da doença.', true),
       (currval('questions_id_seq'), 'B', 'índice de crescimento de casos.', false),
       (currval('questions_id_seq'), 'C', 'exames para diagnóstico do tumor.', false),
       (currval('questions_id_seq'), 'D', 'mitos a respeito da herança genética.', false),
       (currval('questions_id_seq'), 'E', 'período de campanhas de conscientização.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 3, 9,
        'Conforme um dia prometi Onde, confesso que esqueci E embora — perdoe — tão tarde (Melhor do que nunca!) este poeta Segundo manda a boa ética Envia-lhe a receita (poética) De sua feijoada completa. Em atenção ao adiantado Da hora em que abrimos o olho O feijão deve, já catado Nos esperar, feliz, de molho. Uma vez cozido o feijão (Umas quatro horas, fogo médio) Nós bocejando o nosso tédio Nos chegaremos ao fogão [...] De carne-seca suculenta Gordos paios, nédio toucinho (Nunca orelhas de bacorinho Que a tornam em excesso opulenta!) Enquanto ao lado, em fogo brando Dismilinguindo-se de gozo Deve também se estar fritando O torresminho delicioso Em cuja gordura, de resto (Melhor gordura nunca houve!) Deve depois frigir a couve Picada, em fogo alegre e presto. Dever cumprido. Nunca é vã A palavra de um poeta... — jamais! Abraça-a, em Brillat-Savarin, O seu Vinicius de Moraes. MORAES. V. In Cícero. A: QUEIROZ. E. (Org). Vinicius de Moraes nova antologia poética. São Paulo: Cia das Letras, 2005 (fragmento). Apesar de haver marcas formais de carta e receita, a característica que define esse texto como poema é o(a)',
        2);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'nomeação de um interlocutor.', false),
       (currval('questions_id_seq'), 'B', 'manifestação de intimidade.', false),
       (currval('questions_id_seq'), 'C', 'descrição de procedimentos.', false),
       (currval('questions_id_seq'), 'D', 'utilização de uma linguagem expressiva.', true),
       (currval('questions_id_seq'), 'E', 'apresentação de ingredientes culinários.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 3, 9,
        'Os Jogos Olímpicos já não são mais os mesmos. E isso não é nem uma crítica, nem um elogio. É uma constatação. Esse movimento começou com o vôlei de praia tornando-se esporte olímpico em 1996, passou pela chegada do BMX Racing como primeiro "radical" a entrar no programa em 2008, e agora atinge seu momento mais insólito com a inclusão do break dance como modalidade dos Jogos de Paris, em 2024. Para os mais tradicionalistas, o cruzamento da linha que delimitava o que é esporte e o que é cultura e arte é uma afronta ao espírito dos Jogos Olímpicos. Skate e surfe, que há anos têm competições na televisão, pareciam estar na divisa entre esses dois mundos, o limite do aceitável pelos puristas. O break dance estaria do lado de "lá" dessa fronteira. Para o Comitê Olímpico Internacional, a decisão faz parte de uma estratégia de se comunicar com jovens urbanos que se exercitam e se entretêm de uma maneira muito diferente da dos seus avós. Disponível em: www.uol.com.br. Acesso em: 19 nov. 2021 (adaptado). A mudança no programa olímpico mencionada no texto mostra que o esporte está se',
        2);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'aproximando da aventura.', false),
       (currval('questions_id_seq'), 'B', 'mantendo em sua forma padrão.', false),
       (currval('questions_id_seq'), 'C', 'tornando uma forma de dança.', false),
       (currval('questions_id_seq'), 'D', 'afastando de elementos culturais.', false),
       (currval('questions_id_seq'), 'E', 'adaptando às demandas do seu tempo.', true);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('LC', 1, 4,
        'Memes e fake news: o impacto na educação das crianças Há quem diga que o Brasil nunca mais foi o mesmo depois dos memes. Na economia da velocidade, alguns apostam no humor, outros no engajamento político, e tem gente investindo alto na mentira também. Diante desse cenário, uma pergunta se torna essencial: será que todo mundo está conseguindo traduzir as mensagens postadas, curtidas e compartilhadas? Essa dúvida incentivou uma professora de língua portuguesa a desenvolver uma proposta de leitura e análise crítica de memes com estudantes do ensino fundamental, na rede pública do Distrito Federal, na cidade de Samambaia. “Percebi que muitos alunos e pais estavam divulgando conteúdos sem saber o que havia por trás das palavras”, relata a professora. “O que antes era engraçado para os alunos passou a ser visto com outros olhos”, afirma a professora. Para ela, que utilizou a representação da criança em memes de WhatsApp como material gerador das discussões em sala de aula, aguçar o olhar sobre essas mensagens impacta diretamente a atitude de postar, curtir e compartilhar conteúdos ao estimular o uso consciente da informação que circula nas plataformas de mídia social. Letramento político e midiático é um desafio intergeracional. Em tempos de notícias falsas, de imagens manipuladas e de memes sendo usados como triunfo da verdade de cada um, checagem de informação e interpretação de texto acabam se tornando moedas valiosas. Disponível em: http://funetas.com.br. Acesso em: 15 jan. 2024 (adaptação). Ao abordar a relação dos memes com a educação, a reportagem sustenta uma crítica à',
        2);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'falta de fiscalização no uso de aplicativos de mensagens por crianças.',
        false),
       (currval('questions_id_seq'), 'B', 'divulgação de informação manipulada em postagens virtuais.', true),
       (currval('questions_id_seq'), 'C', 'utilização de ferramentas digitais no trabalho educacional.', false),
       (currval('questions_id_seq'), 'D', 'exploração de conteúdos humorísticos nas mídias sociais.', false),
       (currval('questions_id_seq'), 'E', 'propagação de mensagens com objetivos políticos.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 27, 100,
        'Tal qual num exército, não se compreende um efetivo composto apenas de oficiais. Também na saúde pública, os funcionários técnicos graduados necessitam ser assistidos por auxiliares em número suficiente e com preparo adequado, constituído pelas enfermeiras de saúde pública, educadoras ou visitadoras sanitárias, técnicos de laboratório, inspetores ou guardas etc., para não falarmos no pessoal burocrático, não especializado. PAULA SOUZA, G. H.; VIEIRA, F. B. Centro de saúde "eixo" de organização sanitária. Boletim do Instituto de Higiene de São Paulo , n. 59 (adaptado). O texto dos sanitaristas atuantes nas décadas de 1920 e 1930 veicula uma mensagem caracterizada pela',
        1);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'higienização moral.', false),
       (currval('questions_id_seq'), 'B', 'imposição eugênica.', false),
       (currval('questions_id_seq'), 'C', 'assimilação cultural.', false),
       (currval('questions_id_seq'), 'D', 'hegemonização identitária.', false),
       (currval('questions_id_seq'), 'E', 'hierarquização profissional.', true);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 30, 116,
        'O rompimento da barragem de Fundão levou muito consigo. A lama soterrou sonhos e modificou de forma permanente centenas de vidas nascidas e criadas em Bento Rodrigues e Paracatu, em Mariana (MG). Mas não somente. Ao se estender ao longo do rio, outras famílias e histórias foram atingidas de formas diferentes. Ao fugirem dos rejeitos que rapidamente tomaram as localidades, deixaram para trás os resquícios da vida que tiveram até o 5 de novembro de 2015. Nada jamais seria igual. SANTOS, P. Histórias soterradas. Curinga , n. 19, nov. 2016 (adaptado). Conforme o texto, o evento gerou o seguinte impacto na relação entre as pessoas e o seu espaço vivido:',
        1);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'Flexibilização de parâmetros ambientais.', false),
       (currval('questions_id_seq'), 'B', 'Consolidação de identidades regionais.', false),
       (currval('questions_id_seq'), 'C', 'Fragilização de vínculos afetivos.', true),
       (currval('questions_id_seq'), 'D', 'Supressão de práticas exploratórias.', false),
       (currval('questions_id_seq'), 'E', 'Recuperação de tradições ancestrais.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 28, 105,
        'Com a proximidade do final do século XIX, amplificam-se as expectativas com relação ao século seguinte. Se muitas eram as utopias, talvez uma das mais evidentes tenha se concentrado nas potencialidades da nova ciência, com suas invenções e projetos. Não é por mera coincidência que a agenda do país tenha sido tomada pela introdução de uma série de inventos. De forma acelerada, entraram no Brasil a luz elétrica e, com ela, o telégrafo, o telefone, o cinematógrafo. Na área dos transportes, o trem a vapor é substituído pelo elétrico, que assiste à entrada do automóvel e até do aeroplano. COSTA, A. M.; SCHWARCZ, L. M. 1890-1914, no tempo das certezas. São Paulo: Cia. das Letras, 2000 (adaptado). No Brasil, os eventos descritos ganharam conotação política ao serem vinculados à',
        6);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'expansão estratégica do imperialismo.', false),
       (currval('questions_id_seq'), 'B', 'ascensão gradual do mercantilismo.', false),
       (currval('questions_id_seq'), 'C', 'laicidade da educação.', false),
       (currval('questions_id_seq'), 'D', 'retomada do absolutismo.', false),
       (currval('questions_id_seq'), 'E', 'visão republicana de nação.', true);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 28, 105,
        'O bispo Bartolomeu de Las Casas é o homem mais odiado da América, o anti-Cristo dos senhores, o açoite destas terras. Por sua culpa, o imperador promulgou novas leis que despojam de escravos índios os filhos dos conquistadores. O que será deles sem os braços que os sustentam nas minas e nas lavouras? As novas leis estão arrancando a comida de suas bocas. Las Casas é o homem mais amado da América. Voz dos mudos, teimoso defensor dos que recebem pior tratamento que o esterco das praças, denunciador de quem por cobiça converte Jesus Cristo no mais cruel dos deuses e o rei em lobo faminto de carne humana. GALEANO, E. Os nascimentos. Porto Alegre: L&PM, 2011 (adaptado). Os diferentes pontos de vista presentes no texto expressam que o bispo era, ao mesmo tempo,',
        3);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'execrado pelos reis e reverenciado pelos religiosos do local.', false),
       (currval('questions_id_seq'), 'B', 'detestado pelos colonizadores e respeitado pelos povos do lugar.', true),
       (currval('questions_id_seq'), 'C', 'menosprezado pela colônia e idolatrado pelos governantes da região.', false),
       (currval('questions_id_seq'), 'D', 'desrespeitado pela metrópole e adorado pelos invasores da Espanha.', false),
       (currval('questions_id_seq'), 'E', 'desacatado pelos excluídos e valorizado pelos negociantes negros.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 25, 94,
        'A valsa vienense é a mais antiga das danças de salão tradicional. É dançada desde a Idade Média, quando os pares davam voltas pelo salão realizando giros em torno de si mesmos em postura fechada. Pelo fato de ser dançada aos pares em contato íntimo, a valsa encantava a sociedade medieval, como também sofria proibições por infringir os “bons costumes”. Originária das danças campestres e folclóricas, no século XVI, a aristocracia francesa abandonou a valsa por sua estreita relação com a cultura plebeia, retomando-a posteriormente. FRANCO, N.; FERREIRA, N. Evolução da dança no contexto histórico: aproximações iniciais com o tema. Repertório , n. 26, 2016 (adaptado). A expressão cultural descrita no texto foi rejeitada no início da Idade Moderna por congregar',
        4);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'traços advindos da feitiçaria nórdica.', false),
       (currval('questions_id_seq'), 'B', 'práticas inspiradas em rituais pagãos.', false),
       (currval('questions_id_seq'), 'C', 'regras decorrentes do período renascentista.', false),
       (currval('questions_id_seq'), 'D', 'compassos produzidos em territórios colonizados.', false),
       (currval('questions_id_seq'), 'E', 'elementos provenientes de segmentos populares.', true);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 27, 99,
        'O Black Lives Matter vai para além do nacionalismo estreito que pode prevalecer no seio das comunidades negras, que se limita a apelar aos negros a amar os negros, viver como os negros e comprar produtos dos negros, e mantém à frente do movimento homens negros heterossexuais. Black Lives Matter estima as vidas dos negros e negras homossexuais e transexuais, pessoas incapacitadas, negros sem documentos ou com antecedentes criminais, mulheres e as vidas de todos os negros de todo o espectro de gêneros. LA BOTZ, D. O movimento Black Lives Matter organiza-se e procura definir-se politicamente . Disponível em: www.ufes.br. Acesso em: 4 out. 2021 (adaptado). A reivindicação do movimento norte-americano apresentada no texto consiste na necessidade de',
        4);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'manter a conquista de direitos sociais.', false),
       (currval('questions_id_seq'), 'B', 'integrar a diversidade do grupo identitário.', true),
       (currval('questions_id_seq'), 'C', 'priorizar a preservação de culturas africanas.', false),
       (currval('questions_id_seq'), 'D', 'defender a adoção de valores supremacistas.', false),
       (currval('questions_id_seq'), 'E', 'permitir a permanência do modelo androcêntrico.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 27, 101,
        'Os grupos dominantes são beneficiados em termos de credibilidade e podem, com isso, controlar falas de membros de outros grupos, descredibilizando seus testemunhos com base em concepções compartilhadas de preconceito de identidade (gênero e raça). Algumas formas de preconceito tornam as declarações das pessoas menos importantes devido ao seu pertencimento a determinado grupo social. Assim, um falante recebe menos credibilidade devido ao preconceito do ouvinte. KUHNEN, T. Resenha de The Power and Ethics of Knowing, de Miranda Fricker. Revista Princípios , n. 33, 2013. Com base na reflexão suscitada no texto, o preconceito de identidade é responsável por um tipo de injustiça',
        4);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'estética, que normatiza os padrões corporais.', false),
       (currval('questions_id_seq'), 'B', 'sensorial, que privilegia as habilidades visuais.', false),
       (currval('questions_id_seq'), 'C', 'afetiva, que impede as expressões emocionais.', false),
       (currval('questions_id_seq'), 'D', 'epistêmica, que prejudica as trocas informacionais.', true),
       (currval('questions_id_seq'), 'E', 'econômica, que perpetua as desigualdades materiais.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 27, 101,
        'A alma funciona no meu corpo de maneira maravilhosa. Nele se aloja, certamente, mas sabe bem dele escapar: escapa para ver as coisas através da janela dos meus olhos, escapa para sonhar quando durmo, para sobreviver quando morro. Minha alma durará muito tempo e mais que muito tempo, quando meu corpo vier a apodrecer. Viva minha alma! É meu corpo luminoso, purificado, virtuoso, ágil, móvel, tépido, viscoso; é meu corpo liso, castrado, arredondado como uma bolha de sabão. FOUCAULT, M. O corpo utópico, as heterotopias . São Paulo: Edições N-1, 2013. Esse texto reforça uma concepção metafísica clássica que remete a um(a)',
        3);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'pressuposto lógico.', false),
       (currval('questions_id_seq'), 'B', 'pensamento dicotômico.', true),
       (currval('questions_id_seq'), 'C', 'contemplação da natureza.', false),
       (currval('questions_id_seq'), 'D', 'raciocínio argumentativo.', false),
       (currval('questions_id_seq'), 'E', 'crítica à individualidade.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 25, 91,
        'No primeiro dia, foi colocada uma panela de barro no centro do barracão, a qual representava o espírito do morto presente na sala. Aqueles que dançavam depositavam moedas ao passarem junto dela e, ao seu redor, milho branco, mel, água, acaçás, cachaça. No segundo dia, os ogãs, antes de iniciar a cerimônia, caminharam pelo corredor formado pelas casas, batendo com longas varas de bambus nos seus beirais, até alcançarem o portão de entrada. No terceiro dia, quatro pessoas, as mais influentes do culto, carregaram um lençol, que aparentemente continha um corpo em seu interior. No entanto, esse corpo era formado por folhas verdes de plantas, que foram derramadas sobre uma pessoa. MANZOCHI, H. M. Axexe, um rito de passagem. Revista do Museu de Arqueologia e Etnologia , n. 5, 1995 (adaptado). O ritual brasileiro apresentado no texto representa, para seus adeptos, a',
        6);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'manutenção de uma memória coletiva.', true),
       (currval('questions_id_seq'), 'B', 'contestação de uma identidade étnica.', false),
       (currval('questions_id_seq'), 'C', 'imolação de uma divindade africana.', false),
       (currval('questions_id_seq'), 'D', 'legitimação de uma prática pagã.', false),
       (currval('questions_id_seq'), 'E', 'promissão de uma revolta social.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 27, 104,
        'Espaços públicos não são produtos dados e acabados, uma instituição que, uma vez estabelecida, traria a paz da consensualidade e a perfeita igualdade. São os lugares em que os problemas aparecem e se transformam em debates, em diálogo e em possibilidade de ajuste e compromissos. Por isso, não anulam os conflitos, ao contrário, são canais de comunicação e de visibilidade de oposições. GOMES, P. C. C. Espaço público, espaços públicos. Geographia , n. 44, set.-dez. 2018 (adaptado). As características descritas no texto exibem a importância dos espaços públicos para a',
        1);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'prática do lazer.', false),
       (currval('questions_id_seq'), 'B', 'vigilância da sociedade.', false),
       (currval('questions_id_seq'), 'C', 'erradicação da violência.', false),
       (currval('questions_id_seq'), 'D', 'construção da democracia.', true),
       (currval('questions_id_seq'), 'E', 'diversificação do trabalho.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 25, 92,
        'As instituições que a Idade Média nos legou são de um valor maior e mais imperecível do que suas catedrais. E a universidade é nitidamente uma instituição medieval — tanto quanto a monarquia constitucional, ou os parlamentos, ou o julgamento por meio do júri. As universidades e os produtos imediatos das suas atividades constituem a grande realização da Idade Média na esfera intelectual. RASHDALL, H. apud OLIVEIRA, T. Origem e memória das universidades medievais. Varia História , n. 37, jan.-jun. 2007. De acordo com o texto, o legado das universidades medievais torna-se um relevante patrimônio histórico-cultural por',
        1);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'adotar currículo e método padronizado.', false),
       (currval('questions_id_seq'), 'B', 'rejeitar ideologias e costumes orientais.', false),
       (currval('questions_id_seq'), 'C', 'possuir organização e função mercantil.', false),
       (currval('questions_id_seq'), 'D', 'transmitir técnicas e valores ecumênicos.', false),
       (currval('questions_id_seq'), 'E', 'agregar tradição e conhecimento científico.', true);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 30, 119,
        'Há experiências de lutas sociais de reapropriação cultural da natureza que são movimentos emblemáticos, como a dos serigueiros no Brasil, que da luta sindical para a comercialização da borracha chegaram a inventar o conceito de reserva extrativista e estão avançando para um novo modo de produção, uma nova racionalidade produtiva, mostrando que é possível viver bem, e não apenas sobreviver, em harmonia com a natureza que habitam. O novo planeta que podemos imaginar é feito desses territórios produtivos que não são apenas economias de autossubsistência mas economias que potencializam a produtividade ecológica de seus territórios. LEFF, E. Discursos sustentáveis . São Paulo, Cortez, 2010. (adaptado). O texto expõe a possibilidade de uma nova racionalidade produtiva por meio de uma gestão territorial que se baseia na',
        6);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'integração de mercados regidos por pressões regionais.', false),
       (currval('questions_id_seq'), 'B', 'conexão de valores fundamentados por decisões locais.', true),
       (currval('questions_id_seq'), 'C', 'unificação de preços delimitados por demandas nacionais.', false),
       (currval('questions_id_seq'), 'D', 'normatização de regras construídas por instituições mundiais.', false),
       (currval('questions_id_seq'), 'E', 'valorização de tradições orientadas por determinações globais.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 27, 100,
        'Eu sentia falta do futuro. É claro que eu sabia, muito mesmo antes da recorrência dele, que nunca envelheceria. Era muito provável que eu nunca mais fosse ver o oceano de uma altura de trinta mil pés de novo, uma distância tão grande que não dá nem para distinguir as ondas, nem nenhum barco, de um jeito que faz o oceano parecer um enorme e infinito monólito. Eu poderia imaginá-lo. Eu poderia me lembrar dele. Mas não poderia vê-lo de novo, e me ocorreu que a ambição voraz dos seres humanos nunca é saciada quando os sonhos são realizados, porque há sempre a sensação de que tudo poderia ter sido feito melhor e ser feito outra vez. GREEN, J. A culpa é das estrelas . Rio de Janeiro: Intrínseca, 2012. O texto apresenta uma reflexão da personagem acerca de um problema característico da filosofia contemporânea, que trata da(s)',
        6);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'implicações éticas.', false),
       (currval('questions_id_seq'), 'B', 'finitude humana.', true),
       (currval('questions_id_seq'), 'C', 'limitações da linguagem.', false),
       (currval('questions_id_seq'), 'D', 'pressuposição existencial.', false),
       (currval('questions_id_seq'), 'E', 'objetividade do conhecimento.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 29, 110,
        'Uma das principais atividades provocadas pela arte, a reflexão, é abandonada pela indústria cultural. A indústria cultural seria como uma isca que ilude os indivíduos, com o sonho de que eles são livres, originais, únicos e especiais quando, na verdade, os trata como servos e partes de uma massa homogênea. FONTES, B.; MAGALHÃES, R. O que é indústria cultural? In: BODART, C. N. (Org.). Conceitos e categorias do ensino de sociologia . Maceió: Café com Sociologia, 2021 (adaptado). Ao analisar as consequências da dinâmica apresentada no texto, as autoras destacam a importância do conceito como:',
        4);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'Ferramenta de luta coletiva.', false),
       (currval('questions_id_seq'), 'B', 'Mecanismo de controle social.', true),
       (currval('questions_id_seq'), 'C', 'Instituição de interesse público.', false),
       (currval('questions_id_seq'), 'D', 'Organização da iniciativa privada.', false),
       (currval('questions_id_seq'), 'E', 'Instrumento de manipulação estatal.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 27, 99,
        'Como conclusão provisória, parece então que a globalização tem, sim, o efeito de contestar e deslocar as identidades centradas e "fechadas" de uma cultura nacional. Ela tem um efeito pluralizante sobre as identidades, produzindo uma variedade de possibilidades e novas posições de identificação, e tomando as identidades mais posicionais, mais políticas, mais plurais e diversas; menos fixas, unificadas ou trans-históricas. HALL, S. A identidade cultural na pós-modernidade . Rio de Janeiro: DP&A, 2011. De acordo com o texto, o processo apresentado contribuiu para',
        3);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'elevar a renda da população.', false),
       (currval('questions_id_seq'), 'B', 'abandonar os valores morais.', false),
       (currval('questions_id_seq'), 'C', 'estabelecer a igualdade racial.', false),
       (currval('questions_id_seq'), 'D', 'fortalecer as pautas das minorias.', true),
       (currval('questions_id_seq'), 'E', 'inverter os fluxos das migrações.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 28, 105,
        'Em 1960, a primeira pílula anticoncepcional foi comercializada nos EUA, e, em poucos anos, o método contraceptivo se difundiu pelo mundo, inclusive no Brasil. Em nosso país, a chegada das pílulas anticoncepcionais foi simultânea às discussões neomalthusianas sobre a crise demográfica, à aceleração dos processos de modernização e ao boom da indústria farmacêutica multinacional. DIAS, T. M. et al. A pílula da oportunidade: discursos sobre as pílulas anticoncepcionais em A Gazeta da Farmácia , 1960-1981. História, Ciências, Saúde — Manguinhos , n. 3, jul.-set. 2018 (adaptado). Qual foi o efeito social resultante do avanço tecnológico mencionado no texto?',
        3);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A',
        'O afastamento da autoridade médica na regulação da fecundidade. superação do discurso da moralidade pela ação da mídia estatal. ampliação do debate público sobre o planejamento familiar. centralização da pesquisa científica pelo sistema privado de saúde.',
        false),
       (currval('questions_id_seq'), 'B', 'A superação do discurso da moralidade pela ação da mídia estatal.', true),
       (currval('questions_id_seq'), 'C', 'A ampliação do debate público sobre o planejamento familiar.', false),
       (currval('questions_id_seq'), 'D', 'A centralização da pesquisa científica pelo sistema privado de saúde.',
        false),
       (currval('questions_id_seq'), 'E',
        'O enrijecimento das doutrinas religiosas sobre a organização da vida doméstica.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 28, 108,
        'A internet fortalece o engajamento e a visibilidade de populações tradicionais e indígenas por meio de redes sociais, rádios e veículos de mídia digital. Ela também promove a criação e o fortalecimento de mercados e a inovação nos sistemas de financiamento, integrando pequenos agricultores e produtores de comunidade florestal a cadeias de abastecimento maiores. GROTTERA, C.; CASTRO,L. M.; BRITO, M. C. Como a tecnologia pode ser uma aliada na conservação ambiental. Nexo Jornal , 14 ago. 2021. A adoção da tecnologia mencionada amplia a rentabilidade das comunidades citadas, ao possibilitar o(a):',
        1);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'Valorização da economia local.', true),
       (currval('questions_id_seq'), 'B', 'Elaboração de projetos culturais.', false),
       (currval('questions_id_seq'), 'C', 'Estabelecimento de regras comerciais.', false),
       (currval('questions_id_seq'), 'D', 'Incremento da infraestrutura educacional.', false),
       (currval('questions_id_seq'), 'E', 'Homogeneização da qualificação profissional.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 29, 111,
        'Atribuo a causa desse florescimento estéril a um sistema de educação falso, extraído de livros sobre o assunto escrito por homens que, ao considerar as mulheres mais como fêmeas do que como criaturas humanas, estão mais ansiosos em torná-las damas sedutoras do que esposas afetuosas e mães racionais. O entendimento do sexo feminino tem sido tão distorcido por essa homenagem ilusória de que as mulheres civilizadas de nosso século, com raras exceções, anseiam apenas inspirar amor, quando deveriam nutrir uma ambição mais nobre e exigir respeito por suas capacidades e virtudes. WOLLSTONECRAFT, M. Reivindicação dos direitos da mulher . São Paulo: Boitempo, 2016. Nesse texto, escrito no século XVIII, a autora reivindica para as mulheres a',
        2);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'recuperação de sua participação política.', false),
       (currval('questions_id_seq'), 'B', 'equiparação de ganhos salariais.', false),
       (currval('questions_id_seq'), 'C', 'valorização de seu papel social.', true),
       (currval('questions_id_seq'), 'D', 'distinção de padrões biológicos.', false),
       (currval('questions_id_seq'), 'E', 'ocupação de cargos públicos.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 28, 106, 'Cada objeto é, em si mesmo, um sistema funcionando sistemicamente. Um grande supermercado ou shopping center seria incapaz de existir se não fossem servidos por vias rápidas, estacionamentos adequados e acessíveis, sistemas de transportes públicos com horários regulares e conhecidos e se, no seu próprio interior, as atividades não estivessem subordinadas a uma coordenação. Esse é o caso dos armazéns, dos silos etc. Os portos, a rede rodoviária de um país e, sobretudo, a rede ferroviária são exemplos de objetos complexos e sistêmicos. SANTOS, M. A natureza do espaço : técnica, tempo, razão e emoção. São Paulo: Hucitec, 1996 (adaptado). De acordo com o texto, o território torna-se cada vez mais dotado de objetos com a finalidade de intensificar a', 3);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'desindustrialização da economia.', false),
       (currval('questions_id_seq'), 'B', 'desregulamentação do mercado.', false),
       (currval('questions_id_seq'), 'C', 'concentração da produção.', false),
       (currval('questions_id_seq'), 'D', 'distribuição de renda.', false),
       (currval('questions_id_seq'), 'E', 'dinamização dos fluxos.', true);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 26, 98, 'A 26ª Conferência do Clima das Nações Unidas foi realizada com a perspectiva de que os países tornassem ainda mais ambiciosos os compromissos assumidos no enfrentamento das mudanças climáticas, de modo a evitar que a temperatura global se eleve acima de 1,5 °C, marca que já vinha sendo discutida dentro do Acordo de Paris, de 2015. A pressão do setor empresarial, que se posicionou de maneira contundente nesta COP-26, gerou impacto positivo. O Conselho Empresarial Brasileiro para o Desenvolvimento Sustentável (CEBDS) capitaneou, por meio do movimento Empresários pelo Clima, a adesão de 119 CEOs de importantes empresas e 14 instituições do setor privado, de setores tão diversos como agronegócio, alimentício, aviação, elétrico, farmacêutico, finanças, infraestrutura, logística, papel e celulose, petroquímico, saúde, tecnologia, telefonia e varejo. O Brasil deixa a conferência com o compromisso de fazer valer sua meta e reduzir 50% dos gases de efeito estufa até 2030 em relação aos níveis de 2005 — anteriormente, a meta de redução era de 43%. GROSSI, M. A mais plural das COPs e a lição de casa para o Brasil . Disponível em: www.nexojornal.com.br. Acesso em: 24 nov. 2021 (adaptado). Conforme o texto, o compromisso assumido pelo Brasil foi resultado dos tensionamentos promovidos por', 6);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'povos ribeirinhos e segmentos culturais.', false),
       (currval('questions_id_seq'), 'B', 'blocos econômicos e instituições militares.', false),
       (currval('questions_id_seq'), 'C', 'grupos científicos e universidades públicas.', false),
       (currval('questions_id_seq'), 'D', 'organismos supranacionais e sociedade civil.', true),
       (currval('questions_id_seq'), 'E', 'agentes governamentais e demanda turística.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 29, 114, 'A pessoa com deficiência de qualquer modalidade — seja visual, auditiva, física ou mental — encontra-se em uma posição de grande vulnerabilidade em relação às pessoas sem deficiência, sendo frequentemente marcante a assimetria das relações de poder na interação entre ambas. Tal assimetria de relação hierárquica é multiplicada conforme a severidade de cada caso, sendo ampliada se a pessoa com necessidades especiais pertencer a um outro grupo de risco, por exemplo, se for mulher ou criança. PASIAN, M. S. A negligência parental e a relação com a deficiência: o que mostra a pesquisa nacional. Revista Educação Especial , n. 53, set.-dez. 2015 (adaptado). A realidade abordada no texto indica a necessidade de se promover uma ética interpessoal centrada no', 2);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES
    (currval('questions_id_seq'), 'A', 'cuidado, proteção e valorização dos indivíduos.', true),
    (currval('questions_id_seq'), 'B', 'entendimento, perdão e tolerância dos responsáveis.', false),
    (currval('questions_id_seq'), 'C', 'cerceamento, arregimentação e controle de entidades.', false),
    (currval('questions_id_seq'), 'D', 'regramento, legislação e responsabilização de culpados.', false),
    (currval('questions_id_seq'), 'E', 'ensimesmamento, interiorização e indulgência dos agentes.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 26, 94, 'As capas dos folhetos de cordel, já então ilustradas por postais fotográficos, desenhos ou fotogramas de filmes, demoravam mais de uma semana para serem transformadas em clichês em Recife ou Fortaleza, o que levou a que santeiros e artesãos locais fossem requisitados para cortar na umburana — madeira preferida para o taco xilográfico pela facilidade do talhe e abundância — princesas, dragões, cangaceiros. CARVALHO, G. Xilogravura: os percursos da criação popular. Revista do Instituto de Estudos Brasileiros, n. 39, 1986 (adaptado). No início do século XX, a incorporação da técnica de produção descrita no texto promoveu uma renovação da', 10);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'manifestação jornalística.', false),
       (currval('questions_id_seq'), 'B', 'narrativa literária.', false),
       (currval('questions_id_seq'), 'C', 'indústria regional.', false),
       (currval('questions_id_seq'), 'D', 'estética editorial.', true),
       (currval('questions_id_seq'), 'E', 'cultura erudita.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 25, 92, 'O Círio de Nazaré é uma festa que ocorre, anualmente, na cidade de Belém do Pará, no segundo domingo do mês de outubro. Sua estrutura ritualística tem origem no catolicismo devocional que surge em Portugal por volta do século XV. Até 1789, a festa em louvor a Nossa Senhora de Nazaré, em Belém, era marcada pelas ladainhas e novenas. Em 1790, a Igreja Católica autorizou a realização da festa em homenagem à Virgem. A primeira procissão ocorreu em 1793. Existindo há mais de duzentos anos, a Festa congrega um extenso mosaico de elementos integrados em diferentes planos e graus de intensidade. ALMEIDA, I. M. A. Revisitando o Círio de Nazaré a partir da lente sociológica de Eldorfe Moreira . Boletim do Museu Paraense Emílio Goeldi , n. 3, set.-dez. 2015 (adaptado). O reconhecimento da festa descrita no texto, como patrimônio histórico, encontra sustentação no(a)', 8);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'instituição de políticas públicas de âmbito local.', false),
       (currval('questions_id_seq'), 'B', 'registro de bens culturais de natureza imaterial.', true),
       (currval('questions_id_seq'), 'C', 'tombamento de sítios arqueológicos de propriedade privada.', false),
       (currval('questions_id_seq'), 'D', 'salvaguarda de elementos sacros de expressão regional.', false),
       (currval('questions_id_seq'), 'E', 'categorização de manifestações cristãs de caráter oficial.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 25, 90, 'Os salões permitiam aos escritores da época do Iluminismo adentrar no universo dos poderosos. Figuras como as de Voltaire e Duclos exortavam seus "irmãos" a aproveitarem da mobilidade que era oferecida pela ordem social do Antigo Regime, juntando-se à elite. Nos últimos decênios do Ancien Régime, ele foi se tornando cada vez mais o reduto dos filósofos do Alto Iluminismo, que deixavam os cafés para os tipos inferiores de literário. Com efeito, os cafés se constituíram na antítese lógica dos salões. Eles eram abertos a todos, a um passo da rua. Como é possível constatar, salões e cafés constituem interessantes instituições do espaço público literário através das quais é possível vislumbrar as bases sociais nas quais se assentavam o Alto e o Baixo Iluminismo. HABERMAS, J. Mudança estrutural da esfera pública: investigações quanto a uma categoria da sociedade burguesa . Rio de Janeiro: Tempo Brasileiro, 1984 (adaptado). No período iluminista, os espaços sociais mencionados contribuíram para', 1);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES
    (currval('questions_id_seq'), 'A', 'segregar pensadores e aumentar a circulação de ideias.', true),
    (currval('questions_id_seq'), 'B', 'apoiar revolucionários e perseguir a nobreza local.', false),
    (currval('questions_id_seq'), 'C', 'rejeitar poetisas e proibir a entrada de mulheres.', false),
    (currval('questions_id_seq'), 'D', 'censurar cronistas e coibir o patrocínio editorial.', false),
    (currval('questions_id_seq'), 'E', 'integrar artistas e ampliar o comércio urbano.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 28, 109, 'Resumamos os principais caracteres de um rizoma: diferentemente das árvores ou de suas raízes, o rizoma conecta um ponto qualquer com outro ponto qualquer e cada um de seus traços não remete necessariamente a traços de mesma natureza. Contra os sistemas centrados (e mesmo policentrados), de comunicação hierárquica e ligações preestabelecidas, o rizoma é um sistema a-centrado não hierárquico e não significante, sem general, sem memória organizadora ou autômato central, unicamente definido por uma circulação de estados. DELEUZE, G.; GUATTARI, F. Mil platôs . São Paulo: Editora 34, 1995 (adaptado). Qual elemento da cultura contemporânea se relaciona às características do conceito de rizoma, conforme descrito no texto?', 3);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'Estrutura fixa.', false),
       (currval('questions_id_seq'), 'B', 'Lógica binária.', false),
       (currval('questions_id_seq'), 'C', 'Controle homogêneo.', false),
       (currval('questions_id_seq'), 'D', 'Uniformidade de opiniões.', false),
       (currval('questions_id_seq'), 'E', 'Pluralidade de interações.', true);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 29, 112, 'A regra de ouro, popularmente conhecida pelo provérbio "Trate os outros como gostaria de ser tratado", é um dos princípios morais mais onipresentes. A noção subjacente, que apela para o senso ético mais básico, se expressa de uma forma ou de outra em praticamente todas as tradições religiosas, e poucos filósofos morais deixaram de invocar a regra ou pelo menos de tecer comentários a respeito da relação com seus próprios princípios. DUPRÉ, B. 50 grandes ideias da humanidade . São Paulo: Planeta do Brasil, 2016. O princípio ético apresentado no texto, como elemento estruturante da vida em sociedade, se traduz pela seguinte formulação teórica:', 9);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'Doutrina teleológica.', false),
       (currval('questions_id_seq'), 'B', 'Imperativo categórico.', true),
       (currval('questions_id_seq'), 'C', 'Pensamento utilitarista.', false),
       (currval('questions_id_seq'), 'D', 'Secularização inautêntica.', false),
       (currval('questions_id_seq'), 'E', 'Raciocínio consequencialista.', false);

INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 26, 97, 'O que alicerça, portanto, o acolhimento de refugiados pelos Estados gira em torno da fronteira erguida entre inclusão e exclusão, admissão e rejeição, desejáveis e indesejáveis; ao mesmo tempo, enseja vulnerabilidade, indefinição e incerteza a esses migrantes internacionais forçados. MOREIRA, J. B. Refugiados no Brasil. REMHU , n. 43, jul.-dez. 2014. A eliminação, para os refugiados, do tipo de fronteira descrita no texto necessita de políticas públicas de', 3);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'planejamento familiar.', false),
       (currval('questions_id_seq'), 'B', 'segregação territorial.', false),
       (currval('questions_id_seq'), 'C', 'homogeneização cultural.', false),
       (currval('questions_id_seq'), 'D', 'diferenciação étnico-racial.', false),
       (currval('questions_id_seq'), 'E', 'integração socioeconômica.', true);


INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 25, 91, 'No Brasil, os remanescentes de antigos quilombos, “mocambos”, “comunidades negras rurais”, “quilombos contemporâneos”, “comunidades quilombolas” ou “terras de preto” referem-se a um mesmo patrimônio territorial e cultural inestimável, que só recentemente passaram a ter atenção do Estado e ser do interesse de algumas autoridades e organismos oficiais. ANJOS, R. S. A. Cartografia e quilombos: territórios étnicos africanos no Brasil. Africana Studia , n. 9, 2007. Na esfera de ação do Estado, com a Constituição de 1988, os espaços mencionados tornaram-se objeto de', 1);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'iniciativas de planejamento familiar.', false),
       (currval('questions_id_seq'), 'B', 'projetos de reorientação religiosa.', false),
       (currval('questions_id_seq'), 'C', 'programas de moradias sustentáveis.', false),
       (currval('questions_id_seq'), 'D', 'políticas de inserção social.', true),
       (currval('questions_id_seq'), 'E', 'medidas de homogeneização educacional.', false);


INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 25, 90, 'Bertrand Russell conta a história de um peru que descobrira, em sua primeira manhã na fazenda de perus, que fora alimentado às 9 da manhã. Contudo, ele não tirou conclusões apressadas. Esperou até recolher um grande número de observações do fato de que era alimentado às 9 da manhã e fez essas observações sob uma ampla variedade de circunstâncias, às quartas e quintas-feiras, em dias quentes e dias frios, em dias chuvosos e dias secos. A cada dia acrescentava uma outra proposição de observação à sua lista. Finalmente, sua consciência ficou satisfeita e ele concluiu: "Eu sou alimentado sempre às 9 da manhã". CHALMERS, A. O que é ciência, afinal? São Paulo: Brasiliense, 1993 (adaptado). Qual tipo de raciocínio corresponde ao padrão de pensamento exibido pelo personagem no texto?', 9);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'Prático, porque recolhe evidências e recomenda ações.', false),
       (currval('questions_id_seq'), 'B', 'Absoluto, porque busca confirmações e bloqueia refutações.', false),
       (currval('questions_id_seq'), 'C', 'Indutivo, porque observa eventos particulares e infere leis universais.', true),
       (currval('questions_id_seq'), 'D', 'Demonstrativo, porque encadeia premissas e extrai conclusões indubitáveis.', false),
       (currval('questions_id_seq'), 'E', 'Analógico, porque compara diferentes situações e detecta elementos semelhantes.', false);


INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 26, 96, 'A finalidade mais marcante em toda a história dos mapas, desde o seu início, teria sido a de estarem sempre voltados à prática, principalmente a serviço da dominação, do poder. Sempre registraram o que mais interessava a uma minoria, fato este que acabou estimulando o incessante aperfeiçoamento deles. MARTINELLI, M. Mapas da geografia e cartografia temática. São Paulo: Contexto, 2011 (adaptado). No texto, a cartografia é apresentada como um instrumento usado essencialmente para a', 4);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'preservação de espaços naturais.', false),
       (currval('questions_id_seq'), 'B', 'emancipação de sujeitos marginais.', false),
       (currval('questions_id_seq'), 'C', 'revalorização de culturas reprimidas.', false),
       (currval('questions_id_seq'), 'D', 'inversão de hierarquias estabelecidas.', false),
       (currval('questions_id_seq'), 'E', 'sustentação de hegemonias territoriais.', true);


INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 27, 102, 'Era uma vez um país, uma cidade, uma praça, algumas mães... Las Madres de Plaza de Mayo! Silenciosas, com lenços brancos na cabeça, rondavam a Praça de Maio. Incansáveis, caminharam por dias, meses, anos. Foram chamadas de loucas. Em silêncio, criaram um fato político, escancararam as entranhas da repressão, desafiaram o aparato militar e suas dores ecoaram pelo mundo. Como observou Oliveira, "à luz do dia, sob as janelas do ditador, sob chuva, sob sol, no silêncio entrecortado de gritos, faziam ouvir como que a alucinação de uma litania, que ecoou no país, na América Latina e além-mar". Era impossível ignorá-las, estavam lá, sempre em silêncio, mas estavam lá. GONÇALVES, R. De antigas e novas loucas. Madres e Mães de Maio contra a violência de Estado. Lutas Sociais , n. 29, jul.-dez. 2012. Qual problema de âmbito nacional argentino o movimento social mencionado expôs ao mundo?', 6);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'Violação dos direitos humanos.', true),
       (currval('questions_id_seq'), 'B', 'Insegurança da juventude periférica.', false),
       (currval('questions_id_seq'), 'C', 'Naturalização da violência doméstica.', false),
       (currval('questions_id_seq'), 'D', 'Ampliação das desigualdades sociais.', false),
       (currval('questions_id_seq'), 'E', 'Relativização dos princípios democráticos.', false);


INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 29, 113, 'A democracia responde a esta pergunta: quem deve exercer o poder público? A resposta é: o exercício do poder público corresponde à coletividade dos cidadãos. Contudo, nessa pergunta não se fala sobre qual extensão deva ter o poder público. Trata-se somente de determinar o sujeito a quem o mando compete. A democracia propõe que mandemos todos; quer dizer, que todos intervenham nos fatos sociais. ORTEGA Y GASSET, J. apud MAIA, E. C. Mario Vargas Llosa e o indivíduo para além da tribo . Disponível em: www.estadodaarte.estadao.com.br. Acesso em: 10 out. 2021 (adaptado). O que sustenta o exercício do poder, conforme a configuração apresentada no texto escrito na década de 1920?', 2);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'Soberania popular.', true),
       (currval('questions_id_seq'), 'B', 'Divisão de classes.', false),
       (currval('questions_id_seq'), 'C', 'Acúmulo de capital.', false),
       (currval('questions_id_seq'), 'D', 'Defesa da propriedade.', false),
       (currval('questions_id_seq'), 'E', 'Centralização administrativa.', false);


INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 30, 117, 'A mudança do clima nas cidades brasileiras é um desafio de adaptação e equidade. Inundações, alagamentos e ondas de calor são cada vez mais frequentes e intensas. Cidades precisam se adaptar com urgência, a começar pelas áreas e populações mais vulneráveis. Implementar soluções baseadas na natureza de forma sistêmica pode contribuir para a redução de desastres relacionados às mudanças do clima e ainda gerar múltiplos benefícios para a economia, o ambiente e as pessoas. EVERS, H. et al. Soluções baseadas na natureza para adptação em cidades . Disponível em: www.wribrasil.org.br. Acesso em: 19 out. 2023 (adaptado). Qual medida atenua os problemas abordados no texto?', 7);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'Criação de faixas sinalizadoras.', false),
       (currval('questions_id_seq'), 'B', 'Incineração de resíduos sólidos.', false),
       (currval('questions_id_seq'), 'C', 'Implantação de parques públicos.', true),
       (currval('questions_id_seq'), 'D', 'Verticalização de espaços centrais.', false),
       (currval('questions_id_seq'), 'E', 'Construção de estacionamentos privados.', false);


INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 26, 96, 'O Conselho de Segurança da Organização das Nações Unidas (ONU) é, junto com a Assembleia-Geral, um dos principais órgãos de tomada de decisão dentro da entidade. O Conselho lida com questões de segurança e paz internacionais, além de recomendar a admissão de novos membros à Assembleia-Geral e aprovar mudanças na Carta das Nações Unidas. Cinco dos quinze membros são permanentes e podem vetar resoluções, o que ocorreu 261 vezes até 2020. GOMES, L; PRETTO, N. O funcionamento do Conselho de Segurança das Nações Unidas . Disponível em: www.nexojornal.com.br Acesso em: 10 nov. 2021 (adaptado). A composição e o funcionamento do organismo internacional apresentados revelam a seguinte caracterísitica das relações internacionais entre os países-membros:', 8);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'Igualdade militar.', false),
       (currval('questions_id_seq'), 'B', 'Assimetria política.', true),
       (currval('questions_id_seq'), 'C', 'Consenso multipolar.', false),
       (currval('questions_id_seq'), 'D', 'Equilíbrio estratégico.', false),
       (currval('questions_id_seq'), 'E', 'Soberania compartilhada.', false);


INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty)
VALUES ('CH', 28, 107, 'Uma fábrica na qual os operários fossem, efetiva e integralmente, simples peças de máquinas executando cegamente as ordens da direção pararia em quinze minutos. O capitalismo só pode funcionar com a contribuição constante da atividade propriamente humana de seus subjugados que, ao mesmo tempo, tenta reduzir e desumanizar o mais possível. CASTORIADIS, C. A instituição imaginária da sociedade . Rio de Janeiro: Paz e Terra, 1982. O texto apresenta uma contradição interna do capitalismo caracterizada pela', 6);

INSERT INTO alternatives (question_id, letter, text, is_correct)
VALUES (currval('questions_id_seq'), 'A', 'obsolescência associada ao uso da tecnologia.', false),
       (currval('questions_id_seq'), 'B', 'orientação voltada à administração de conflitos.', false),
       (currval('questions_id_seq'), 'C', 'alienação decorrente da organização do trabalho.', true),
       (currval('questions_id_seq'), 'D', 'isonomia remanescente da geração de riquezas.', false),
       (currval('questions_id_seq'), 'E', 'produtividade vinculada ao fortalecimento da autonomia.', false);

