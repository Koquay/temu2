const router = require('express').Router();
const productController = require('./product.controller');

console.log('category.routes called...')
router.get('/1/category', productController.getCategory)
router.get('/', productController.getProducts)
router.get('/:productId', productController.getProduct)
router.get('/search/1', productController.searchForProducts)


module.exports = router;