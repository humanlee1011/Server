const Router = require('koa-router');
const router = new Router();

router.use(require('./restaurantAccount').routes());
router.use(require('./customerAccount').routes());
router.use(require('./table').routes());
router.use(require('./category').routes());
router.use(require('./dish').routes());
router.use(require('./system').routes());
router.use(require('./order').routes());

module.exports = router.routes();
