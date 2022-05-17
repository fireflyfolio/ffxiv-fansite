const Router = require('koa-router');

const ctrl = require('../controllers/auth');

const router = new Router();
router.post('/signin', ctrl.signin);
router.post('/refresh', ctrl.refresh);

module.exports = router.routes();
