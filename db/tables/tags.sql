-- Table: lbfamily.tags

-- DROP TABLE IF EXISTS lbfamily.tags;

CREATE TABLE IF NOT EXISTS lbfamily.tags
(
    id integer NOT NULL DEFAULT nextval('lbfamily.tags_id_seq'::regclass),
    label character varying(200) COLLATE pg_catalog."default" NOT NULL,
    total integer NOT NULL DEFAULT 0,
    CONSTRAINT pk_tags_id PRIMARY KEY (id)
        USING INDEX TABLESPACE lbfamily,
    CONSTRAINT uk_tags_label UNIQUE (label)
        USING INDEX TABLESPACE lbfamily
)

TABLESPACE lbfamily;

ALTER TABLE IF EXISTS lbfamily.tags
    OWNER to lbfamily_owner;

GRANT ALL ON TABLE lbfamily.tags TO lbfamily_api;

GRANT ALL ON TABLE lbfamily.tags TO lbfamily_owner;
-- Index: idx_tags_label

-- DROP INDEX IF EXISTS lbfamily.idx_tags_label;

CREATE INDEX IF NOT EXISTS idx_tags_label
    ON lbfamily.tags USING btree
    (label COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE lbfamily;