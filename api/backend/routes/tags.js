const Router = require('koa-router');

const { fetchAll } = require('../controllers/tags');

const router = new Router();

router.get('/', fetchAll);

module.exports = router.routes();
