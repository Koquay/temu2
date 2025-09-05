const cartService = require("./cart.service");

exports.saveCart = (req, res) => {
    cartService.saveCart(req, res);
}