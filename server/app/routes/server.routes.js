const path = require('path');
const express = require('express');

const indexRoutes = require('../index/index.routes');
const productRoutes = require('../product/product.routes');
const orderRoutes = require('../order/order.routes');
const authRoutes = require('../auth/auth.routes');
const paymentRoutes = require('../payment/payment.routes');
const cartRoutes = require('../cart/cart.routes');

process.env.DIST = path.join(__dirname, "../../../client/dist/client/browser");
console.log("DIST", process.env.DIST)
process.env.INDEX = path.join(process.env.DIST, "/index.html");

module.exports = (app) => {
    console.log('server.routes called...')

    app.use(express.static(process.env.DIST))

    app.use('/api/product', productRoutes)
    // app.use('/api/product', productRoutes)
    app.use('/api/order', orderRoutes)
    app.use('/api/auth', authRoutes)
    app.use('/api/payment', paymentRoutes)
    app.use('/api/cart', cartRoutes)
    app.use(/(.*)/, indexRoutes);
}