export default {
  api: {
    server: 'http://localhost:4000',
    contents: '/v1/contents',
    backend: {
      contents: '/v1/backend/contents',
      contents_files: '/v1/backend/contents/{id}/files',
      contents_relations: '/v1/backend/contents/{id}/relations',
      contents_tags: '/v1/backend/contents/{id}/tags',
      tags: '/v1/backend/tags',
      auth: '/v1/backend/auth'
    }
  },
  cookies: {
    expires: 1
  },
  spotlight: {
    timeout: 4000,
  }
};
