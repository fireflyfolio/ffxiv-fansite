GRANT CONNECT ON DATABASE lbfamily TO lbfamily_api;
GRANT ALL ON SCHEMA public TO lbfamily_api;
GRANT ALL ON SCHEMA admin TO lbfamily_api;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO lbfamily_api;
GRANT ALL ON ALL SEQUENCES IN SCHEMA admin TO lbfamily_api;
GRANT ALL ON public.contents TO lbfamily_api;
GRANT ALL ON public.contents_relations TO lbfamily_api;
GRANT ALL ON public.contents_tags TO lbfamily_api;
GRANT ALL ON public.tags TO lbfamily_api;
GRANT ALL ON admin.users TO lbfamily_api;