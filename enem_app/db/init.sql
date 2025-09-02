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

