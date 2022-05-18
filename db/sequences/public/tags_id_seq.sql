-- SEQUENCE: public.tags_id_seq

-- DROP SEQUENCE IF EXISTS public.tags_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.tags_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.tags_id_seq
    OWNER TO lbfamily_owner;

GRANT ALL ON SEQUENCE public.tags_id_seq TO lbfamily_api;

GRANT ALL ON SEQUENCE public.tags_id_seq TO lbfamily_owner;