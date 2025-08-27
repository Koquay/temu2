const paymentService = require("./payment.service");

exports.createPaymentIntent = (req, res) => {
    paymentService.createPaymentIntent(req, res);
}