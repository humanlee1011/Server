const Router = require('koa-router');
const router = new Router();
const ctrl = require('../controller/order');
const { onlyRestaurant, onlyCustomer } = require('../../lib/authorize');

router.post('/order', onlyCustomer, ctrl.createOrder);
router.post('/order/:id/payment', onlyCustomer, ctrl.pay);
router.get('/restaurant/self/order', onlyRestaurant, ctrl.getRestaurantOrder);
router.put('/order/:id', onlyRestaurant, ctrl.updateOrder);

module.exports = router;
