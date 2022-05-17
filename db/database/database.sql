-- Database: lbfamily

-- DROP DATABASE lbfamily;

CREATE DATABASE lbfamily
    WITH
    OWNER = lbfamily_owner
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = lbfamily
    CONNECTION LIMIT = -1;

GRANT TEMPORARY ON DATABASE lbfamily TO PUBLIC;

GRANT ALL ON DATABASE lbfamily TO lbfamily_owner;
