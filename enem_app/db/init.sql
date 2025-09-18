-- USERS
CREATE TABLE public.users (
    id_user BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    nickname VARCHAR(50),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(30) NOT NULL,
    level INT NOT NULL DEFAULT 1,
    xp_points INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- KNOWLEDGE AREAS
CREATE TABLE public.knowledge_areas (
    id VARCHAR(2) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- COMPETENCIES
CREATE TABLE public.competencies (
    id BIGSERIAL PRIMARY KEY,
    area_id VARCHAR(2) NOT NULL REFERENCES knowledge_areas(id),
    description TEXT NOT NULL
);

-- SKILLS
CREATE TABLE public.skills (
    id BIGSERIAL PRIMARY KEY,
    competency_id BIGINT NOT NULL REFERENCES competencies(id),
    code VARCHAR(10) NOT NULL,
    description TEXT NOT NULL,
    UNIQUE (competency_id, code)
);

-- QUESTIONS
CREATE TABLE public.questions (
    id BIGSERIAL PRIMARY KEY,
    area_id VARCHAR(2) NOT NULL REFERENCES knowledge_areas(id),
    competency_id BIGINT NOT NULL REFERENCES competencies(id),
    skill_id BIGINT NOT NULL REFERENCES skills(id),
    text TEXT NOT NULL,
    difficulty NUMERIC(3,1) NOT NULL,
    year INT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ALTERNATIVES
CREATE TABLE public.alternatives (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    -- letra de referência (A..E) para vinculação externa; NÃO usada como fonte da verdade de correção
    letter CHAR(1) CHECK (letter IS NULL OR letter IN ('A','B','C','D','E')),
    text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Único índice para evitar letras duplicadas por questão (se usar letter)
CREATE UNIQUE INDEX uq_alternatives_question_letter ON alternatives (question_id, letter)
WHERE letter IS NOT NULL;

-- Garante no máximo 1 alternativa marcada como correta por questão
CREATE UNIQUE INDEX ux_one_correct_alternative_per_question ON alternatives (question_id)
WHERE is_correct;

-- LEVELS
CREATE TABLE public.levels (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    min_difficulty NUMERIC(3,1) NOT NULL,
    max_difficulty NUMERIC(3,1) NOT NULL,
    CHECK (min_difficulty <= max_difficulty)
);

-- SESSIONS (simulados/rodadas)
CREATE TABLE public.sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id_user),
    area_id VARCHAR(2) NOT NULL REFERENCES knowledge_areas(id),
    level_id BIGINT NOT NULL REFERENCES levels(id),
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at TIMESTAMPTZ
);

-- ATTEMPTS (respostas dos usuários)
CREATE TABLE public.attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id_user),
    question_id BIGINT NOT NULL REFERENCES questions(id),
    alternative_id BIGINT NOT NULL REFERENCES alternatives(id),
    is_correct BOOLEAN NOT NULL,
    answer_time_ms INT,
    session_id BIGINT REFERENCES sessions(id),
    presented_mapping JSONB, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para attempts
CREATE INDEX ix_attempts_user_question ON attempts (user_id, question_id);
CREATE INDEX ix_attempts_question ON attempts (question_id);
CREATE INDEX ix_attempts_user ON attempts (user_id);

-- USER_LEVELS (progressão por área)
CREATE TABLE public.user_levels (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id_user),
    area_id VARCHAR(2) NOT NULL REFERENCES knowledge_areas(id),
    level_id BIGINT NOT NULL REFERENCES levels(id),
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX ux_user_area_level ON user_levels (user_id, area_id, level_id);

-- ACHIEVEMENTS
CREATE TABLE public.achievements (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id_user),
    skill_id BIGINT NOT NULL REFERENCES skills(id),
    achieved_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_achievements_user ON achievements (user_id);
CREATE INDEX ix_achievements_skill ON achievements (skill_id);

-- FLASHCARDS
CREATE TABLE public.flashcards (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id_user),
    question_id BIGINT,
    area_id VARCHAR(2) NOT NULL REFERENCES knowledge_areas(id),
    term VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ix_flashcards_user ON flashcards (user_id);

-- TOKENS (JWTs ou refresh tokens)
CREATE TABLE public.tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id_user),
    token TEXT NOT NULL UNIQUE,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX ix_tokens_user ON tokens (user_id);

-- PASSWORD RESET
CREATE TABLE public.password_reset (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id_user),
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES ADICIONAIS SUGERIDOS
CREATE INDEX ix_questions_difficulty ON questions (difficulty);
CREATE INDEX ix_questions_area_competency_skill ON questions (area_id, competency_id, skill_id);
CREATE INDEX ix_skills_competency ON skills (competency_id);

--Inserção de dados

INSERT INTO public.knowledge_areas (id, name) VALUES
                                                  ('LC', 'Linguagens, Códigos e suas Tecnologias'),
                                                  ('CH', 'Ciências Humanas e suas Tecnologias'),
                                                  ('CN', 'Ciências da Natureza e suas Tecnologias'),
                                                  ('MT', 'Matemática e suas Tecnologias');


INSERT INTO levels (name, min_difficulty, max_difficulty) VALUES
                                                              ('Muito Fácil',  1, 10),
                                                              ('Fácil', 11, 17),
                                                              ('Médio', 18, 24),
                                                              ('Difícil', 25, 29),
                                                              ('Muito Difícil', 30, 99);

-- Inserção de competências da área LC, conforme Matriz de Referência do ENEM

INSERT INTO competencies (area_id, description) VALUES
                                                    ('LC', 'Aplicar as tecnologias da comunicacao e da informacao na escola, no trabalho e em outros contextos relevantes para sua vida.'),
                                                    ('LC', 'Conhecer e usar linguas estrangeiras modernas como instrumento de acesso a informacoes e a outras culturas e grupos sociais.'),
                                                    ('LC', 'Compreender e usar a linguagem corporal como relevante para a propria vida, integradora social e formadora da identidade.'),
                                                    ('LC', 'Compreender a arte como saber cultural e estetico gerador de significacao e integrador da organizacao do mundo e da propria identidade.'),
                                                    ('LC', 'Analisar, interpretar e aplicar recursos expressivos das linguagens, relacionando textos com seus contextos, mediante a natureza, funcao, organizacao e estrutura das manifestacoes.'),
                                                    ('LC', 'Compreender e usar os sistemas simbolicos das diferentes linguagens como meios de organizacao cognitiva da realidade pela constituicao de significados, expressao, comunicacao e informacao.');

-- Inserção de habilidades (skills) para LC (cada competência associada sequencialmente às habilidades)
INSERT INTO skills (competency_id, code, description) VALUES
-- Competência 1 (LC) – habilidades H1 a H4

(1, 'H1', 'Identificar as diferentes linguagens e seus recursos expressivos como elementos de caracterizacao dos sistemas de comunicacao.'),
(1, 'H2', 'Recorrer aos conhecimentos sobre as linguagens dos sistemas de comunicacao e informacao para resolver problemas sociais.'),
(1, 'H3', 'Relacionar informacoes geradas nos sistemas de comunicacao e informacao, considerando a funcao social desses sistemas.'),
(1, 'H4', 'Reconhecer posicoes criticas aos usos sociais que sao feitos das linguagens e dos sistemas de comunicacao e informacao.'),
-- Competência 2 (LC) – habilidades H5 a H8

(2, 'H5', 'Associar vocabulos e expressoes de um texto em LEM ao seu tema.'),
(2, 'H6', 'Utilizar os conhecimentos da LEM e de seus mecanismos como meio de ampliar as possibilidades de acesso a informacoes, tecnologias e culturas.'),
(2, 'H7', 'Relacionar um texto em LEM, as estruturas linguisticas, sua funcao e seu uso social.'),
(2, 'H8', 'Reconhecer a importancia da producao cultural em LEM como representacao da diversidade cultural e linguistica.'),
-- Competência 3 (LC) – habilidades H9 a H11

(3, 'H9', 'Reconhecer as manifestacoes corporais de movimento como originarias de necessidades cotidianas de um grupo social.'),
(3, 'H10', 'Reconhecer a necessidade de transformacao de habitos corporais em funcao das necessidades cinestesicas.'),
(3, 'H11', 'Reconhecer a linguagem corporal como meio de interacao social, considerando os limites de desempenho e as alternativas de adaptacao para diferentes individuos.'),
-- Competência 4 (LC) – habilidades H12 a H14

(4, 'H12', 'Reconhecer diferentes funcoes da arte, do trabalho da producao dos artistas em seus meios culturais.'),
(4, 'H13', 'Analisar as diversas producoes artisticas como meio de explicar diferentes culturas, padroes de beleza e preconceitos.'),
(4, 'H14', 'Reconhecer o valor da diversidade artistica e das inter-relacoes de elementos que se apresentam nas manifestacoes de varios grupos sociais e etnicos.'),
-- Competência 5 (LC) – habilidades H15 a H17

(5, 'H15', 'Estabelecer relacoes entre o texto literario e o momento de sua producao, situando aspectos do contexto historico, social e politico.'),
(5, 'H16', 'Relacionar informacoes sobre concepcoes artisticas e procedimentos de construcao do texto literario.'),
(5, 'H17', 'Reconhecer a presenca de valores sociais e humanos atualizaveis e permanentes no patrimonio literario nacional.'),
-- Competência 6 (LC) – habilidades H18 a H20

(6, 'H18', 'Identificar os elementos que concorrem para a progressao tematica e para a organizacao e estruturacao de textos de diferentes generos e tipos.'),
(6, 'H19', 'Analisar a funcao da linguagem predominante nos textos em situacoes especificas de interlocucao.'),
(6, 'H20', 'Reconhecer a importancia do patrimonio linguistico para a preservacao da memoria e da identidade nacional.');

-- Inserção de competências da área CH, conforme Matriz de Referência do ENEM

INSERT INTO competencies (area_id, description) VALUES
                                                    ('CH', 'Compreender os elementos culturais que constituem as identidades.'),
                                                    ('CH', 'Compreender as transformacoes dos espacos geograficos como produto das relacoes socioeconomicas e culturais de poder.'),
                                                    ('CH', 'Compreender a producao e o papel historico das instituicoes sociais, politicas e economicas, associando-as aos diferentes grupos, conflitos e movimentos sociais.'),
                                                    ('CH', 'Entender as transformacoes tecnicas e tecnologicas e seu impacto nos processos de producao, no desenvolvimento do conhecimento e na vida social.'),
                                                    ('CH', 'Utilizar os conhecimentos historicos para compreender e valorizar os fundamentos da cidadania e da democracia, favorecendo uma atuacao consciente do individuo na sociedade.');

-- Inserção de habilidades para CH (cada competência com 4 habilidades)
INSERT INTO skills (competency_id, code, description) VALUES
-- Competência 7 (CH) – habilidades H1 a H4

(7, 'H1', 'Interpretar historicamente e/ou geograficamente fontes documentais acerca de aspectos da cultura.'),
(7, 'H2', 'Analisar a producao da memoria pelas sociedades humanas.'),
(7, 'H3', 'Associar as manifestacoes culturais do presente aos seus processos historicos.'),
(7, 'H4', 'Comparar pontos de vista expressos em diferentes fontes sobre determinado aspecto da cultura.'),
-- Competência 8 (CH) – habilidades H6 a H9

(8, 'H6', 'Interpretar diferentes representacoes graficas e cartograficas dos espacos geograficos.'),
(8, 'H7', 'Identificar os significados historico-geograficos das relacoes de poder entre as nacoes.'),
(8, 'H8', 'Analisar a acao dos estados nacionais no que se refere a dinamica dos fluxos populacionais e no enfrentamento de problemas de ordem economico-social.'),
(8, 'H9', 'Comparar o significado historico-geografico das organizacoes politicas e socioeconomicas em escala local, regional ou mundial.'),
-- Competência 9 (CH) – habilidades H11 a H14

(9, 'H11', 'Identificar registros de praticas de grupos sociais no tempo e no espaco.'),
(9, 'H12', 'Analisar o papel da justica como instituicao na organizacao das sociedades.'),
(9, 'H13', 'Analisar a atuacao dos movimentos sociais que contribuíram para mudancas ou rupturas em processos de disputa pelo poder.'),
(9, 'H14', 'Comparar diferentes pontos de vista, presentes em textos analiticos e interpretativos, sobre situacoes ou fatos de natureza historico-geografica acerca das instituicoes sociais, politicas e economicas.'),
-- Competência 10 (CH) – habilidades H16 a H19

(10, 'H16', 'Identificar registros sobre o papel das tecnicas e tecnologias na organizacao do trabalho e/ou da vida social.'),
(10, 'H17', 'Analisar fatores que explicam o impacto das novas tecnologias no processo de territorializacao da producao.'),
(10, 'H18', 'Analisar diferentes processos de producao ou circulacao de riquezas e suas implicacoes socio-espaciais.'),
(10, 'H19', 'Reconhecer as transformacoes tecnicas e tecnologicas que determinam as varias formas de uso e apropriacao dos espacos rural e urbano.'),
-- Competência 11 (CH) – habilidades H21 a H24

(11, 'H21', 'Identificar o papel dos meios de comunicacao na construcao da vida social.'),
(11, 'H22', 'Analisar as lutas sociais e conquistas obtidas no que se refere as mudancas nas legislacoes ou nas politicas publicas.'),
(11, 'H23', 'Analisar a importancia dos valores eticos na estruturacao politica das sociedades.'),
(11, 'H24', 'Relacionar cidadania e democracia na organizacao das sociedades.');

-- Inserção de competências da área CN, conforme Matriz de Referência do ENEM

INSERT INTO competencies (area_id, description) VALUES
                                                    ('CN', 'Compreender as ciencias naturais e as tecnologias a elas associadas como construcoes humanas, percebendo seus papeis nos processos de producao e no desenvolvimento economico e social da humanidade.'),
                                                    ('CN', 'Identificar a presenca e aplicar as tecnologias associadas as ciencias naturais em diferentes contextos.'),
                                                    ('CN', 'Associar intervencoes que resultam em degradacao ou conservacao ambiental a processos produtivos e sociais e a instrumentos ou acoes cientifico-tecnologicos.'),
                                                    ('CN', 'Compreender interacoes entre organismos e ambiente, em particular aquelas relacionadas a saude humana, relacionando conhecimentos cientificos, aspectos culturais e caracteristicas individuais.'),
                                                    ('CN', 'Entender metodos e procedimentos proprios das ciencias naturais e aplica-los em diferentes contextos.'),
                                                    ('CN', 'Apropriar-se de conhecimentos da fisica para, em situacoes problema, interpretar, avaliar ou planejar intervencoes cientifico-tecnologicas.');

-- Inserção de habilidades para CN
INSERT INTO skills (competency_id, code, description) VALUES
-- Competência 1 (CN) – habilidades H1 a H4

(12, 'H1', 'Reconhecer caracteristicas ou propriedades de fenomenos ondulatorios ou oscilatorios, relacionando-os a seus usos em diferentes contextos.'),
(12, 'H2', 'Associar a solucao de problemas de comunicacao, transporte, saude ou outro, com o correspondente desenvolvimento cientifico e tecnologico.'),
(12, 'H3', 'Confrontar interpretacoes cientificas com interpretacoes baseadas no senso comum, ao longo do tempo ou em diferentes culturas.'),
(12, 'H4', 'Avaliar propostas de intervencao no ambiente, considerando a qualidade da vida humana ou medidas de conservacao, recuperacao ou utilizacao sustentavel da biodiversidade.'),
-- Competência 13 (CN) – habilidades H5 a H7

(13, 'H5', 'Dimensionar circuitos ou dispositivos eletricos de uso cotidiano.'),
(13, 'H6', 'Relacionar informacoes para compreender manuais de instalacao ou utilizacao de aparelhos, ou sistemas tecnologicos de uso comum.'),
(13, 'H7', 'Selecionar testes de controle, parametros ou criterios para a comparacao de materiais e produtos, tendo em vista a defesa do consumidor, a saude do trabalhador ou a qualidade de vida.'),
-- Competência 14 (CN) – habilidades H8 a H11

(14, 'H8', 'Identificar etapas em processos de obtencao, transformacao, utilizacao ou reciclacao de recursos naturais, energeticos ou materias-primas, considerando processos biologicos, quimicos ou fisicos neles envolvidos.'),
(14, 'H9', 'Compreender a importancia dos ciclos biogeoquimicos ou do fluxo de energia para a vida, ou da acao de agentes ou fenomenos que podem causar alteracoes nesses processos.'),
(14, 'H10', 'Analisar perturbacoes ambientais, identificando fontes, transporte e (ou) destino dos poluentes ou prevendo efeitos em sistemas naturais, produtivos ou sociais.'),
(14, 'H11', 'Reconhecer beneficios, limitacoes e aspectos eticos da biotecnologia, considerando estruturas e processos biologicos envolvidos em produtos biotecnologicos.'),
-- Competência 15 (CN) – habilidades H13 a H16

(15, 'H13', 'Reconhecer mecanismos de transmissao da vida, prevendo ou explicando a manifestacao de caracteristicas dos seres vivos.'),
(15, 'H14', 'Identificar padroes em fenomenos e processos vitais dos organismos, como manutencao do equilibrio interno, defesa, relacoes com o ambiente, sexualidade, entre outros.'),
(15, 'H15', 'Interpretar modelos e experimentos para explicar fenomenos ou processos biologicos em qualquer nivel de organizacao dos sistemas biologicos.'),
(15, 'H16', 'Compreender o papel da evolucao na producao de padroes, processos biologicos ou na organizacao taxonomica dos seres vivos.'),
-- Competência 16 (CN) – habilidades H17 a H19

(16, 'H17', 'Relacionar informacoes apresentadas em diferentes formas de linguagem e representacao usadas nas ciencias fisicas, quimicas ou biologicas, como texto discursivo, graficos, tabelas, relacoes matematicas ou linguagem simbolica.'),
(16, 'H18', 'Relacionar propriedades fisicas, quimicas ou biologicas de produtos, sistemas ou procedimentos tecnologicos as finalidades a que se destinam.'),
(16, 'H19', 'Avaliar metodos, processos ou procedimentos das ciencias naturais que contribuam para diagnosticar ou solucionar problemas de ordem social, economica ou ambiental.'),
-- Competência 17 (CN) – habilidades H20 e H21

(17, 'H20', 'Caracterizar causas ou efeitos dos movimentos de particulas, substancias, objetos ou corpos celestes.'),
(17, 'H21', 'Utilizar leis fisicas e (ou) quimicas para interpretar processos naturais.');

-- Inserção de competências da área MT, conforme Matriz de Referência do ENEM

INSERT INTO competencies (area_id, description) VALUES
                                                    ('MT', 'Construir significados para os numeros naturais, inteiros, racionais e reais.'),
                                                    ('MT', 'Utilizar o conhecimento geometrico para realizar a leitura e a representacao da realidade e agir sobre ela.'),
                                                    ('MT', 'Construir nocoes de grandezas e medidas para a compreensao da realidade e a solucao de problemas do cotidiano.'),
                                                    ('MT', 'Construir nocoes de variacao de grandezas para a compreensao da realidade e a solucao de problemas do cotidiano.'),
                                                    ('MT', 'Modelar e resolver problemas que envolvem variaveis socioeconomicas ou tecnico-cientificas, usando representacoes algebraicas.'),
                                                    ('MT', 'Interpretar informacoes de natureza cientifica e social obtidas da leitura de graficos e tabelas, realizando previsao de tendencia, extrapolacao, interpolacao e interpretacao.');

-- Inserção de habilidades para MT
INSERT INTO skills (competency_id, code, description) VALUES
-- Competência 18 (MT) – habilidades H1 a H4

(18, 'H1', 'Reconhecer, no contexto social, diferentes significados e representacoes dos numeros e operacoes - naturais, inteiros, racionais ou reais.'),
(18, 'H2', 'Identificar padroes numericos ou principios de contagem.'),
(18, 'H3', 'Resolver situacao-problema envolvendo conhecimentos numericos.'),
(18, 'H4', 'Avaliar a razoabilidade de um resultado numerico na construcao de argumentos sobre afirmacoes quantitativas.'),
-- Competência 19 (MT) – habilidades H6 a H9

(19, 'H6', 'Interpretar a localizacao e a movimentacao de pessoas/objetos no espaco tridimensional e sua representacao no espaco bidimensional.'),
(19, 'H7', 'Identificar caracteristicas de figuras planas ou espaciais.'),
(19, 'H8', 'Resolver situacao-problema que envolva conhecimentos geometricos de espaco e forma.'),
(19, 'H9', 'Utilizar conhecimentos geometricos de espaco e forma na selecao de argumentos propostos como solucao de problemas do cotidiano.'),
-- Competência 20 (MT) – habilidades H10 a H13

(20, 'H10', 'Identificar relacoes entre grandezas e unidades de medida.'),
(20, 'H11', 'Utilizar a nocao de escalas na leitura de representacao de situacao do cotidiano.'),
(20, 'H12', 'Resolver situacao-problema que envolva medidas de grandezas.'),
(20, 'H13', 'Avaliar o resultado de uma medicao na construcao de um argumento consistente.'),
-- Competência 21 (MT) – habilidades H15 a H18

(21, 'H15', 'Identificar a relacao de dependencia entre grandezas.'),
(21, 'H16', 'Resolver situacao-problema envolvendo a variacao de grandezas, direta ou inversamente proporcionais.'),
(21, 'H17', 'Analisar informacoes envolvendo a variacao de grandezas como recurso para a construcao de argumentacao.'),
(21, 'H18', 'Avaliar propostas de intervencao na realidade envolvendo variacao de grandezas.'),
-- Competência 22 (MT) – habilidades H19 a H22


(22, 'H19', 'Identificar representacoes algebraicas que expressem a relacao entre grandezas.'),
(22, 'H20', 'Interpretar grafico cartesiano que represente relacoes entre grandezas.'),
(22, 'H21', 'Resolver situacao-problema cuja modelagem envolva conhecimentos algebricos.'),
(22, 'H22', 'Utilizar conhecimentos algebraicos/ geometricos como recurso para a construcao de argumentacao.'),
-- Competência 23 (MT) – habilidades H24 a H26

(23, 'H24', 'Utilizar informacoes expressas em graficos ou tabelas para fazer inferencias.'),
(23, 'H25', 'Resolver problema com dados apresentados em tabelas ou graficos.'),
(23, 'H26', 'Analisar informacoes expressas em graficos ou tabelas como recurso para a construcao de argumentos.');

-- Questão 1 (Competência 19, Skill 66 - identificar características de figuras planas)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('MT', 19, 66, 'Uma figura plana tem três lados iguais e três ângulos internos congruentes. Que figura é essa?', 4.0);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', 'Trapézio', false),
                                                                     ( currval('questions_id_seq'), 'B', 'Retângulo', false),
                                                                     ( currval('questions_id_seq'), 'C', 'Triângulo equilátero', true),
                                                                     ( currval('questions_id_seq'), 'D', 'Losango', false),
                                                                     ( currval('questions_id_seq'), 'E', 'Pentágono regular', false);

-- Questão 2 (Competência 19, Skill 65 - interpretar localização/movimentação no espaço)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('MT', 19, 65, 'Um ponto A tem coordenadas (2,3) num plano cartesiano e o ponto B tem coordenadas (5,3). Se um objeto se move de A para B, a que direção (horizontal/vertical) ele se deslocou?', 3.5);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', 'Vertical para cima', false),
                                                                     ( currval('questions_id_seq'), 'B', 'Vertical para baixo', false),
                                                                     ( currval('questions_id_seq'), 'C', 'Horizontal para a direita', true),
                                                                     ( currval('questions_id_seq'), 'D', 'Diagonal superior direita', false),
                                                                     ( currval('questions_id_seq'), 'E', 'Diagonal inferior esquerda', false);

-- Questão 3 (Competência 20, Skill 69 - identificar relações entre grandezas/unidades)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('MT', 20, 69, 'Um terreno tem 2 hectares. Quantos metros quadrados tem esse terreno? (1 hectare = 10.000 m²)', 5.0);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', '2.000 m²', false),
                                                                     ( currval('questions_id_seq'), 'B', '20.000 m²', true),
                                                                     ( currval('questions_id_seq'), 'C', '200.000 m²', false),
                                                                     ( currval('questions_id_seq'), 'D', '10.000 m²', false),
                                                                     ( currval('questions_id_seq'), 'E', '5.000 m²', false);

-- Questão 4 (Competência 20, Skill 70 - utilizar noção de escalas)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('MT', 20, 70, 'Num mapa com escala 1:50.000, 1 cm no mapa representa 500 m na realidade. Qual a distância real representada por 3 cm no mapa?', 4.5);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', '150 m', false),
                                                                     ( currval('questions_id_seq'), 'B', '1500 m', false),
                                                                     ( currval('questions_id_seq'), 'C', '15000 m', false),
                                                                     ( currval('questions_id_seq'), 'D', '1500 km', false),
                                                                     ( currval('questions_id_seq'), 'E', '1500 m (1,5 km)', true);

-- Questão 5 (Competência 19, Skill 67 - resolver situação-problema com conhecimentos de espaço e forma)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('MT', 19, 67, 'Para construir uma caixa retangular com base 2 m por 3 m e altura 1 m, qual é o volume da caixa em metros cúbicos?', 5.5);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', '5 m³', false),
                                                                     ( currval('questions_id_seq'), 'B', '6 m³', true),
                                                                     ( currval('questions_id_seq'), 'C', '3 m³', false),
                                                                     ( currval('questions_id_seq'), 'D', '2 m³', false),
                                                                     ( currval('questions_id_seq'), 'E', '1 m³', false);

-- Questão 1 (Competência 19, Skill 67 - resolver situação-problema com espaço e forma)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('MT', 19, 67, 'Um triângulo retângulo tem catetos medindo 9 cm e 12 cm. Qual é o comprimento da hipotenusa (em cm)?', 12.0);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', '15', true),
                                                                     ( currval('questions_id_seq'), 'B', '13', false),
                                                                     ( currval('questions_id_seq'), 'C', '√225', false),
                                                                     ( currval('questions_id_seq'), 'D', '21', false),
                                                                     ( currval('questions_id_seq'), 'E', '√(81+144)', false);

-- Questão 2 (Competência 19, Skill 65 - interpretar localização/movimentação no espaço)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('MT', 19, 65, 'No plano cartesiano, um ponto parte de P(-2,4) e vai até Q(3,-1). Qual é o vetor de deslocamento PQ?', 11.5);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', '(5, -5)', true),
                                                                     ( currval('questions_id_seq'), 'B', '(-5, 5)', false),
                                                                     ( currval('questions_id_seq'), 'C', '(5, 5)', false),
                                                                     ( currval('questions_id_seq'), 'D', '(-3, 5)', false),
                                                                     ( currval('questions_id_seq'), 'E', '(3, -1)', false);

-- Questão 3 (Competência 20, Skill 69 - identificar relações entre grandezas/unidades)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('MT', 20, 69, 'Um carro percorre 90 km em uma hora. Qual é sua velocidade média em metros por segundo (m/s)? (1 km = 1000 m)', 14.0);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', '25 m/s', false),
                                                                     ( currval('questions_id_seq'), 'B', '90/3600 m/s', false),
                                                                     ( currval('questions_id_seq'), 'C', '25,0 m/s', true),
                                                                     ( currval('questions_id_seq'), 'D', '15 m/s', false),
                                                                     ( currval('questions_id_seq'), 'E', '2,5 m/s', false);

-- Questão 4 (Competência 20, Skill 71 - utilizar noção de escalas/medidas)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('MT', 20, 70, 'Num mapa a escala é 1:100.000. Se a distância real entre duas cidades é 120 km, qual será a distância aproximada no mapa em centímetros?', 13.5);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', '12 cm', false),
                                                                     ( currval('questions_id_seq'), 'B', '120 cm', false),
                                                                     ( currval('questions_id_seq'), 'C', '1,2 cm', false),
                                                                     ( currval('questions_id_seq'), 'D', '1200 cm', false),
                                                                     ( currval('questions_id_seq'), 'E', '1,20 cm', true);

-- Questão 5 (Competência 19, Skill 68 - utilizar conhecimentos geométricos na seleção de argumentos)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('MT', 19, 68, 'Dois triângulos são semelhantes se seus ângulos correspondentes são congruentes. Se um triângulo tem lados 3, 4, 5 e outro triângulo tem um lado correspondente medindo 9, qual é a razão de semelhança e o comprimento do lado correspondente ao 4 (no primeiro)?', 16.0);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', 'Razão 3; lado correspondente = 12', true),
                                                                     ( currval('questions_id_seq'), 'B', 'Razão 2; lado correspondente = 8', false),
                                                                     ( currval('questions_id_seq'), 'C', 'Razão 3; lado correspondente = 9', false),
                                                                     ( currval('questions_id_seq'), 'D', 'Razão 1/3; lado correspondente = 4/3', false),
                                                                     ( currval('questions_id_seq'), 'E', 'Razão 3; lado correspondente = 15', false);

-- Q1 (Competência 1, Skill 1 H1: identificar linguagens e recursos expressivos)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('LC', 1, 1, 'Em um anúncio publicitário, qual recurso linguístico mais contribui para chamar a atenção do leitor imediatamente?', 3.0);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', 'Uso de imagens de baixa resolução', false),
                                                                     ( currval('questions_id_seq'), 'B', 'Texto em parágrafos longos e densos', false),
                                                                     ( currval('questions_id_seq'), 'C', 'Uso de um título curto e chamativo', true),
                                                                     ( currval('questions_id_seq'), 'D', 'Ausência de contraste entre fundo e fonte', false),
                                                                     ( currval('questions_id_seq'), 'E', 'Uso de linguagem excessivamente técnica', false);

-- Q2 (Competência 1, Skill 2 H2: recorrer aos conhecimentos para resolver problemas sociais)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('LC', 1, 2, 'Como a linguagem jornalística pode contribuir para resolver um problema social local?', 4.0);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', 'Ignorando opiniões da comunidade', false),
                                                                     ( currval('questions_id_seq'), 'B', 'Divulgando informações verificadas e promovendo debate público', true),
                                                                     ( currval('questions_id_seq'), 'C', 'Publicando apenas informações técnicas sem contexto', false),
                                                                     ( currval('questions_id_seq'), 'D', 'Privando a população de acesso à informação', false),
                                                                     ( currval('questions_id_seq'), 'E', 'Usando linguagem incompreensível para o público', false);

-- Q3 (Competência 2, Skill 5 H5: associar vocábulos de LEM ao tema)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('LC', 2, 5, 'Em um texto em língua estrangeira moderna sobre clima, o termo "precipitation" se refere a:', 4.5);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', 'Temperatura', false),
                                                                     ( currval('questions_id_seq'), 'B', 'Precipitação (chuva/queda de água)', true),
                                                                     ( currval('questions_id_seq'), 'C', 'Vento forte', false),
                                                                     ( currval('questions_id_seq'), 'D', 'Nível de poluição', false),
                                                                     ( currval('questions_id_seq'), 'E', 'Nuvem baixa', false);

-- Q4 (Competência 3, Skill 9 H9: reconhecer manifestações corporais de movimento)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('LC', 3, 9, 'Num espetáculo de teatro, um gesto repetido pelo personagem pode indicar principalmente:', 3.5);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', 'Uma falha técnica', false),
                                                                     ( currval('questions_id_seq'), 'B', 'Uma característica de personalidade ou emoção', true),
                                                                     ( currval('questions_id_seq'), 'C', 'O horário do espetáculo', false),
                                                                     ( currval('questions_id_seq'), 'D', 'O preço do ingresso', false),
                                                                     ( currval('questions_id_seq'), 'E', 'A iluminação de cena', false);

-- Q5 (Competência 1, Skill 3 H3: relacionar informações geradas nos sistemas de comunicação)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('LC', 1, 3, 'Ao comparar dois posts sobre o mesmo assunto em plataformas distintas, qual verificação é essencial para avaliar a credibilidade da informação?', 5.0);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', 'Verificar se ambos têm o mesmo número de curtidas', false),
                                                                     ( currval('questions_id_seq'), 'B', 'Checar a fonte original e referências citadas', true),
                                                                     ( currval('questions_id_seq'), 'C', 'Considerar apenas o texto mais curto', false),
                                                                     ( currval('questions_id_seq'), 'D', 'Desconsiderar comentários de leitores', false),
                                                                     ( currval('questions_id_seq'), 'E', 'Confiar automaticamente em imagens compartilhadas', false);


-- Q6 (Competência 2, Skill 6 H6: utilizar conhecimentos da LEM para ampliar acesso)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('LC', 2, 6, 'Leia trecho de um artigo em inglês: "The rapid dissemination of misinformation poses significant challenges to public health." Qual expressão melhor traduz a ideia central do trecho?', 22.0);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', 'A lenta difusão de informação melhora a saúde pública', false),
                                                                     ( currval('questions_id_seq'), 'B', 'A disseminação rápida de desinformação cria desafios à saúde pública', true),
                                                                     ( currval('questions_id_seq'), 'C', 'A informação não tem impacto na saúde pública', false),
                                                                     ( currval('questions_id_seq'), 'D', 'Aumento da confiança em informações médicas', false),
                                                                     ( currval('questions_id_seq'), 'E', 'A diminuição de notícias online', false);


-- Questão 1 – Interpretação de Texto
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('LC', 1, 1, 'Qual é a principal ideia defendida pelo autor no texto?', 13.0);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', 'A importância da leitura crítica.', true),
                                                                     ( currval('questions_id_seq'), 'B', 'A necessidade de mais tempo para leitura.', false),
                                                                     ( currval('questions_id_seq'), 'C', 'A crítica ao sistema educacional.', false),
                                                                     ( currval('questions_id_seq'), 'D', 'A defesa da leitura digital.', false),
                                                                     ( currval('questions_id_seq'), 'E', 'A valorização da literatura clássica.', false);

-- Questão 2 – Literatura Brasileira
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('LC', 1, 2, 'Quem é o autor da obra "Dom Casmurro"?', 12.5);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', 'Machado de Assis', false),
                                                                     ( currval('questions_id_seq'), 'B', 'José de Alencar', false),
                                                                     ( currval('questions_id_seq'), 'C', 'Aluísio Azevedo', false),
                                                                     ( currval('questions_id_seq'), 'D', 'Clarice Lispector', false),
                                                                     ( currval('questions_id_seq'), 'E', 'Machado de Assis', true);

-- Questão 3 – Gramática
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('LC', 2, 6, 'Assinale a alternativa em que há erro de concordância verbal.', 14.0);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', 'Ele vai ao mercado.', false),
                                                                     ( currval('questions_id_seq'), 'B', 'Nós fomos à escola.', false),
                                                                     ( currval('questions_id_seq'), 'C', 'Eles cantam no coral.', false),
                                                                     ( currval('questions_id_seq'), 'D', 'Eu vi o filme ontem.', false),
                                                                     ( currval('questions_id_seq'), 'E', 'Tu vai ao cinema.', true);

-- Questão 4 – Literatura Portuguesa
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('LC', 3, 9, 'Qual é o principal tema abordado na obra "Os Maias"?', 15.0);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', 'A crítica à sociedade portuguesa.', true),
                                                                     ( currval('questions_id_seq'), 'B', 'A história de amor proibido.', false),
                                                                     ( currval('questions_id_seq'), 'C', 'A luta pela independência.', false),
                                                                     ( currval('questions_id_seq'), 'D', 'A busca pela felicidade.', false),
                                                                     ( currval('questions_id_seq'), 'E', 'A imigração para o Brasil.', false);

-- Questão 5 – Interpretação de Texto
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('LC', 4, 13, 'O que o autor pretende transmitir com a expressão "caminho das pedras"?', 16.0);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', 'Facilidade e sucesso.', false),
                                                                     ( currval('questions_id_seq'), 'B', 'Dificuldades e desafios.', true),
                                                                     ( currval('questions_id_seq'), 'C', 'Caminho sem obstáculos.', false),
                                                                     ( currval('questions_id_seq'), 'D', 'Rumo certo e sem erros.', false),
                                                                     ( currval('questions_id_seq'), 'E', 'Caminho curto e rápido.', false);

-- Q7 (Competência 1, Skill 4 H4: reconhecer posições críticas aos usos sociais das linguagens)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('LC', 1, 4, 'Uma campanha publicitária que estereotipa um grupo social pode ser criticada porque:', 24.0);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', 'Aumenta o acesso à informação', false),
                                                                     ( currval('questions_id_seq'), 'B', 'Fortalece preconceitos e reproduz desigualdades', true),
                                                                     ( currval('questions_id_seq'), 'C', 'Sempre promove inclusão social', false),
                                                                     ( currval('questions_id_seq'), 'D', 'Melhora a comunicação intercultural', false),
                                                                     ( currval('questions_id_seq'), 'E', 'Não tem relação com normas sociais', false);

-- Q8 (Competência 3, Skill 11 H11: reconhecer linguagem corporal como meio de interação social)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('LC', 3, 11, 'Num contexto escolar, um professor que mantém postura corporal fechada e evita contato visual tende a transmitir:', 28.5);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', 'Abertura e acolhimento', false),
                                                                     ( currval('questions_id_seq'), 'B', 'Desinteresse ou distância', true),
                                                                     ( currval('questions_id_seq'), 'C', 'Entusiasmo excessivo', false),
                                                                     ( currval('questions_id_seq'), 'D', 'Alegria contagiante', false),
                                                                     ( currval('questions_id_seq'), 'E', 'Clareza absoluta na comunicação', false);

-- Q9 (Competência 2, Skill 7 H7: relacionar texto em LEM às estruturas linguísticas)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('LC', 2, 7, 'Num texto em inglês, a estrutura "Although he studied hard, he failed the exam." apresenta qual função sintática do "Although"?', 23.0);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', 'Conexão causal (porque)', false),
                                                                     ( currval('questions_id_seq'), 'B', 'Conjunção adversativa (embora)', true),
                                                                     ( currval('questions_id_seq'), 'C', 'Partícula modal de dúvida', false),
                                                                     ( currval('questions_id_seq'), 'D', 'Indicador de tempo futuro', false),
                                                                     ( currval('questions_id_seq'), 'E', 'Conjunção de coordenação conclusiva', false);

-- Q10 (Competência 1, Skill 1 H1: identificar diferentes linguagens e recursos expressivos)
INSERT INTO questions (area_id, competency_id, skill_id, text, difficulty) VALUES
    ('LC', 1, 1, 'Uma notícia multimodal combina texto, imagem e elementos gráficos. Qual é a vantagem principal desse formato para o leitor?', 21.0);

INSERT INTO alternatives (question_id, letter, text, is_correct) VALUES
                                                                     ( currval('questions_id_seq'), 'A', 'Reduzir a quantidade de informação disponível', false),
                                                                     ( currval('questions_id_seq'), 'B', 'Facilitar a compreensão por múltiplos canais sensoriais', true),
                                                                     ( currval('questions_id_seq'), 'C', 'Impedir leitura crítica', false),
                                                                     ( currval('questions_id_seq'), 'D', 'Garantir que somente especialistas entendam', false),
                                                                     ( currval('questions_id_seq'), 'E', 'Substituir completamente o texto por imagens', false);