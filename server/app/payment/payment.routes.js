const router = require('express').Router();
const paymentController = require('./payment.controller');

router.post('/payment-intent', paymentController.createPaymentIntent);

module.exports = router;