const router = require('express').Router();
const cartController = require('./cart.controller');

router.post('/', cartController.saveCart)

module.exports = router;