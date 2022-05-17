GRANT CONNECT ON DATABASE lbfamily TO lbfamily_api;
GRANT ALL ON SCHEMA lbfamily TO lbfamily_api;
GRANT ALL ON ALL SEQUENCES IN SCHEMA lbfamily TO lbfamily_api;
GRANT ALL ON lbfamily.contents TO lbfamily_api;
GRANT ALL ON lbfamily.contents_relations TO lbfamily_api;
GRANT ALL ON lbfamily.contents_tags TO lbfamily_api;
GRANT ALL ON lbfamily.users TO lbfamily_api;
GRANT ALL ON lbfamily.tags TO lbfamily_api;