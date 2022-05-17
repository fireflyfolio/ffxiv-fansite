SELECT datname, usename, application_name, client_addr FROM pg_stat_activity;
REVOKE CONNECT ON DATABASE lbfamily FROM public;
