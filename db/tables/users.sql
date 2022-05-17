-- Table: lbfamily.users

-- DROP TABLE IF EXISTS lbfamily.users;

CREATE TABLE IF NOT EXISTS lbfamily.users
(
    id integer NOT NULL,
    username character varying(200) COLLATE pg_catalog."default" NOT NULL,
    password character varying(200) COLLATE pg_catalog."default" NOT NULL,
    settings json NOT NULL,
    CONSTRAINT pk_users_id PRIMARY KEY (id)
        USING INDEX TABLESPACE lbfamily,
    CONSTRAINT uk_users_username UNIQUE (username)
        USING INDEX TABLESPACE lbfamily
)

TABLESPACE lbfamily;

ALTER TABLE IF EXISTS lbfamily.users
    OWNER to lbfamily_owner;

GRANT ALL ON TABLE lbfamily.users TO lbfamily_api;

GRANT ALL ON TABLE lbfamily.users TO lbfamily_owner;
-- Index: idx_sites_username

-- DROP INDEX IF EXISTS lbfamily.idx_sites_username;

CREATE INDEX IF NOT EXISTS idx_sites_username
    ON lbfamily.users USING btree
    (username COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE lbfamily;