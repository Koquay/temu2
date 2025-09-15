const router = require('express').Router();
const cartController = require('./cart.controller');

router.post('/', cartController.saveCart)
router.get('/', cartController.getCart)

module.exports = router;