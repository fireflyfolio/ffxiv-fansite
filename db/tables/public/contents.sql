-- Table: public.contents

-- DROP TABLE IF EXISTS public.contents;

CREATE TABLE IF NOT EXISTS public.contents
(
    id integer NOT NULL DEFAULT nextval('contents_id_seq'::regclass),
    status integer NOT NULL DEFAULT 0,
    type integer NOT NULL DEFAULT 1,
    creation_date date NOT NULL DEFAULT now(),
    update_date date NOT NULL DEFAULT now(),
    title character varying(200) COLLATE pg_catalog."default" NOT NULL,
    summary character varying(5000) COLLATE pg_catalog."default",
    body json,
    is_focus boolean NOT NULL DEFAULT false,
    is_pin boolean NOT NULL DEFAULT false,
    password character varying(20) COLLATE pg_catalog."default",
    cover character varying(200) COLLATE pg_catalog."default",
    items json,
    CONSTRAINT pk_contents_id PRIMARY KEY (id)
        USING INDEX TABLESPACE lbfamily
)

TABLESPACE lbfamily;

ALTER TABLE IF EXISTS public.contents
    OWNER to lbfamily_owner;

GRANT ALL ON TABLE public.contents TO lbfamily_api;

GRANT ALL ON TABLE public.contents TO lbfamily_owner;
-- Index: idx_contents_is_focus

-- DROP INDEX IF EXISTS public.idx_contents_is_focus;

CREATE INDEX IF NOT EXISTS idx_contents_is_focus
    ON public.contents USING btree
    (is_focus ASC NULLS LAST)
    TABLESPACE lbfamily;
-- Index: idx_contents_is_pin

-- DROP INDEX IF EXISTS public.idx_contents_is_pin;

CREATE INDEX IF NOT EXISTS idx_contents_is_pin
    ON public.contents USING btree
    (is_pin ASC NULLS LAST)
    TABLESPACE lbfamily;
-- Index: idx_contents_status

-- DROP INDEX IF EXISTS public.idx_contents_status;

CREATE INDEX IF NOT EXISTS idx_contents_status
    ON public.contents USING btree
    (status ASC NULLS LAST)
    TABLESPACE lbfamily;
-- Index: idx_contents_type

-- DROP INDEX IF EXISTS public.idx_contents_type;

CREATE INDEX IF NOT EXISTS idx_contents_type
    ON public.contents USING btree
    (type ASC NULLS LAST)
    TABLESPACE lbfamily;