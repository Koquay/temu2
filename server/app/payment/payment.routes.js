const router = require('express').Router();
const paymentController = require('./payment.controller');

router.post('/payment-intent', paymentController.createPaymentIntent);
router.post('/create-paypal-order', paymentController.createPaypalOrder);
router.post('/capture-paypal-order/:orderID', paymentController.capturePaypalOrder);

module.exports = router;