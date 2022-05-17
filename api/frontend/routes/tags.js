const Router = require('koa-router');

const ctrl = require('../controllers/tags');

const router = new Router();
router.get('/', ctrl.hello);

module.exports = router.routes();
