-- SEQUENCE: lbfamily.tags_id_seq
-- DROP SEQUENCE lbfamily.tags_id_seq;
CREATE SEQUENCE lbfamily.tags_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE lbfamily.tags_id_seq
    OWNER TO lbfamily_owner;

GRANT ALL ON SEQUENCE lbfamily.tags_id_seq TO lbfamily_api;

GRANT ALL ON SEQUENCE lbfamily.tags_id_seq TO lbfamily_owner;
