-- Table: lbfamily.contents_tags

-- DROP TABLE IF EXISTS lbfamily.contents_tags;

CREATE TABLE IF NOT EXISTS lbfamily.contents_tags
(
    content_id integer NOT NULL,
    tag_id integer NOT NULL,
    CONSTRAINT fk_contents_tags_contents_id FOREIGN KEY (content_id)
        REFERENCES lbfamily.contents (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID,
    CONSTRAINT fk_contents_tags_tags_id FOREIGN KEY (tag_id)
        REFERENCES lbfamily.tags (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE lbfamily;

ALTER TABLE IF EXISTS lbfamily.contents_tags
    OWNER to lbfamily_owner;

GRANT ALL ON TABLE lbfamily.contents_tags TO lbfamily_api;

GRANT ALL ON TABLE lbfamily.contents_tags TO lbfamily_owner;
-- Index: idx_articles_tags_article_id

-- DROP INDEX IF EXISTS lbfamily.idx_articles_tags_article_id;

CREATE INDEX IF NOT EXISTS idx_articles_tags_article_id
    ON lbfamily.contents_tags USING btree
    (content_id ASC NULLS LAST)
    TABLESPACE lbfamily;
-- Index: idx_articles_tags_tag_id

-- DROP INDEX IF EXISTS lbfamily.idx_articles_tags_tag_id;

CREATE INDEX IF NOT EXISTS idx_articles_tags_tag_id
    ON lbfamily.contents_tags USING btree
    (tag_id ASC NULLS LAST)
    TABLESPACE lbfamily;