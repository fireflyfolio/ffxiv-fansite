const Router = require('koa-router');

const { fetchAll, fetch, fetchRelations } = require('../controllers/contents');

const router = new Router();

router.get('/:id/relations', fetchRelations);
router.get('/:id', fetch);
router.get('/', fetchAll);

module.exports = router.routes();
