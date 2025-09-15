const cartService = require("./cart.service");

exports.saveCart = (req, res) => {
    cartService.saveCart(req, res);
}

exports.getCart = (req, res) => {
    cartService.getCart(req, res);
}