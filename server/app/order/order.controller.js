const orderService = require("./order.service");

exports.placeOrder = (req, res) => {
    orderService.placeOrder(req, res);
}