const router = require('express').Router();
const orderController = require('./order.controller');

router.post('/', orderController.placeOrder)

module.exports = router;