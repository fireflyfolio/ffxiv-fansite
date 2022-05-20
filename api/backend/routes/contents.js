const Router = require('koa-router');

const {
  fetchAll, fetch, create, update, remove, fetchTypes,
  createFiles, removeFiles,
  fetchRelations, createRelations, updateRelations, removeRelations,
  fetchTags, createTags, updateTags, removeTags,
} = require('../controllers/contents');

const router = new Router();

router.post('/:id/files', createFiles);
router.delete('/:id/files/:fid', removeFiles);

router.get('/:id/relations', fetchRelations);
router.post('/:id/relations', createRelations);
router.put('/:id/relations/:rid', updateRelations);
router.delete('/:id/relations/:rid', removeRelations);

router.get('/:id/tags', fetchTags);
router.post('/:id/tags', createTags);
router.put('/:id/tags/:tid', updateTags);
router.delete('/:id/tags/:tid', removeTags);

router.get('/types', fetchTypes);
router.get('/:id', fetch);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.get('/', fetchAll);

module.exports = router.routes();
