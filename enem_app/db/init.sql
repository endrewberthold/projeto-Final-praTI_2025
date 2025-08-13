-- Criar tipos ENUM
CREATE TYPE XP_TYPE AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE ENUM_ORDER_TYPE AS ENUM ('1', '2', '3', '4', '5');

-- Criar tabelas

CREATE TABLE public.skills (
                               id_skill UUID PRIMARY KEY,
                               name_skill VARCHAR(255) NOT NULL
);

CREATE TABLE public.modules (
                                id_module UUID PRIMARY KEY,
                                id_skill UUID NOT NULL REFERENCES public.skills (id_skill),
                                name_module VARCHAR(255) NOT NULL,
                                "order" ENUM_ORDER_TYPE NOT NULL
);

CREATE TABLE public.levels (
                               id_level UUID PRIMARY KEY,
                               id_module UUID NOT NULL REFERENCES public.modules (id_module),
                               "order" ENUM_ORDER_TYPE NOT NULL,
                               required_score FLOAT NOT NULL
);

CREATE TABLE public.subjects (
                                 id_subject UUID PRIMARY KEY,
                                 name_subject VARCHAR(255) NOT NULL
);

CREATE TABLE public.questions (
                                  id_question UUID PRIMARY KEY,
                                  id_level UUID NOT NULL REFERENCES public.levels (id_level),
                                  id_subject UUID NOT NULL REFERENCES public.subjects (id_subject),
                                  text VARCHAR(255) NOT NULL,
                                  option_a VARCHAR(255) NOT NULL,
                                  option_b VARCHAR(255) NOT NULL,
                                  option_c VARCHAR(255) NOT NULL,
                                  option_d VARCHAR(255) NOT NULL,
                                  option_e VARCHAR(255) NOT NULL,
                                  correct CHAR(1) NOT NULL
);

CREATE TABLE public.users (
                              id_user UUID PRIMARY KEY,
                              email VARCHAR(50) NOT NULL,
                              name VARCHAR(100) NOT NULL,
                              password_hash VARCHAR(30) NOT NULL,
                              create_at TIMESTAMP NOT NULL
);

CREATE TABLE public.ranking (
                                id_ranking UUID PRIMARY KEY,
                                xp XP_TYPE NOT NULL,
                                id_user UUID REFERENCES public.users (id_user)
);

CREATE TABLE public.answers (
                                id_answers UUID PRIMARY KEY,
                                id_user UUID NOT NULL REFERENCES public.users (id_user),
                                id_question UUID NOT NULL REFERENCES public.questions (id_question),
                                select_option CHAR(2) NOT NULL,
                                is_correct BOOLEAN NOT NULL,
                                atttempt_count XP_TYPE NOT NULL,
                                answered_at TIMESTAMP NOT NULL
);

CREATE TABLE public.flashcards (
                                   id_flashcard UUID PRIMARY KEY,
                                   user_id UUID NOT NULL REFERENCES public.users (id_user),
                                   concept VARCHAR(255) NOT NULL,
                                   description TEXT NOT NULL,
                                   id_subject UUID NOT NULL REFERENCES public.subjects (id_subject),
                                   id_question UUID REFERENCES public.questions (id_question),
                                   create_date TIMESTAMP NOT NULL
);

--  índices
CREATE INDEX users_index_0 ON public.users (id_user);
CREATE INDEX questions_index_0 ON public.questions (id_question);
