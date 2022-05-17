-- Tablespace: lbfamily

-- DROP TABLESPACE lbfamily;

CREATE TABLESPACE lbfamily
  OWNER lbfamily_owner
  LOCATION '/usr/data/lbfamily';

ALTER TABLESPACE lbfamily
  OWNER TO lbfamily_owner;
