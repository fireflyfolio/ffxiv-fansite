const Router = require('koa-router');

const { fetchAll, fetch, fetchRelations, fetchTypes } = require('../controllers/contents');

const router = new Router();

router.get('/types', fetchTypes);
router.get('/', fetchAll);
router.get('/:id/relations', fetchRelations);
router.get('/:id', fetch);

module.exports = router.routes();
