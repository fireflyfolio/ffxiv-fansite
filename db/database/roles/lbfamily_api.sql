-- Role: lbfamily_api
-- DROP ROLE lbfamily_api;

CREATE ROLE lbfamily_api WITH
  LOGIN
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;
