-- Table: lbfamily.contents_relations

-- DROP TABLE IF EXISTS lbfamily.contents_relations;

CREATE TABLE IF NOT EXISTS lbfamily.contents_relations
(
    content_id integer NOT NULL,
    relation_id integer NOT NULL,
    "position" integer NOT NULL DEFAULT 1,
    status integer NOT NULL DEFAULT 1,
    CONSTRAINT uk_contents_relations_id UNIQUE (content_id, relation_id)
        USING INDEX TABLESPACE lbfamily,
    CONSTRAINT fk_contents_relations_contents FOREIGN KEY (content_id)
        REFERENCES lbfamily.contents (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT fk_contents_relations_relations FOREIGN KEY (relation_id)
        REFERENCES lbfamily.contents (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)

TABLESPACE lbfamily;

ALTER TABLE IF EXISTS lbfamily.contents_relations
    OWNER to lbfamily_owner;

GRANT ALL ON TABLE lbfamily.contents_relations TO lbfamily_api;

GRANT ALL ON TABLE lbfamily.contents_relations TO lbfamily_owner;