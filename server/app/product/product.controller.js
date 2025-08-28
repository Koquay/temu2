const productService = require('./product.service');


exports.getCategory = (req, res) => {
    console.log('product.controller called...');
    productService.getCategory(req, res);
}

exports.getProducts = (req, res) => {
    console.log('product.controller.getProducts called...');
    productService.getProducts(req, res);
}

exports.getProduct = (req, res) => {
    console.log('product.controller.getProduct called...');
    productService.getProduct(req, res);
}

exports.searchForProducts = (req, res) => {
    console.log('product.controller.searchForProducts called...');
    productService.searchForProducts(req, res);
}


