-- SEQUENCE: lbfamily.contents_id_seq
-- DROP SEQUENCE IF EXISTS lbfamily.contents_id_seq;
CREATE SEQUENCE IF NOT EXISTS lbfamily.contents_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE lbfamily.contents_id_seq
    OWNER TO lbfamily_owner;

GRANT ALL ON SEQUENCE lbfamily.contents_id_seq TO lbfamily_api;

GRANT ALL ON SEQUENCE lbfamily.contents_id_seq TO lbfamily_owner;