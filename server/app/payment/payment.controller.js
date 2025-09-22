const paymentService = require("./payment.service");

exports.createPaymentIntent = (req, res) => {
    paymentService.createPaymentIntent(req, res);
}

exports.createPaypalOrder = (req, res) => {
    paymentService.createPaypalOrder(req, res);
}

exports.capturePaypalOrder = (req, res) => {
    paymentService.capturePaypalOrder(req, res);
}