-- Table: public.contents_relations

-- DROP TABLE IF EXISTS public.contents_relations;

CREATE TABLE IF NOT EXISTS public.contents_relations
(
    content_id integer NOT NULL,
    relation_id integer NOT NULL,
    "position" integer NOT NULL DEFAULT 1,
    status integer NOT NULL DEFAULT 1,
    CONSTRAINT uk_contents_relations_id UNIQUE (content_id, relation_id)
        USING INDEX TABLESPACE lbfamily,
    CONSTRAINT fk_contents_relations_contents FOREIGN KEY (content_id)
        REFERENCES public.contents (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_contents_relations_relations FOREIGN KEY (relation_id)
        REFERENCES public.contents (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE lbfamily;

ALTER TABLE IF EXISTS public.contents_relations
    OWNER to lbfamily_owner;

GRANT ALL ON TABLE public.contents_relations TO lbfamily_api;

GRANT ALL ON TABLE public.contents_relations TO lbfamily_owner;