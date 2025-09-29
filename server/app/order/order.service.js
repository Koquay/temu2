const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

let res;

require("./order.model");
require("../product/product.model");

const Order = require("mongoose").model("Order");
const ObjectId = require("mongoose").Types.ObjectId;
const email = require('../util/email/email.service');
const nodemailer = require('../util/email/nodemailer.service');

exports.placeOrder = async (req, response) => {
    
    const orderData = req.body;
    console.log('orderData', orderData)
    res = response;
  
    const token = req.headers.authorization.split(" ")[1];
  
    console.log('token', token)
  
    try {
  
      let newOrder = new Order(orderData.orderData);
      console.log("newOrder", newOrder);
  
      newOrder.userId = new ObjectId(orderData.user);
      
      await newOrder.save();
  
      const returnOrder = await getOrder(newOrder._id);
      sendOrderConfirmationEmail(returnOrder);
      res.status(201).json(returnOrder);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Problem placing order..");
    }
  };
  
  const getOrder = async (orderId) => {
    try {
      const order = await Order.findOne({
        _id: orderId,
      }).populate({
        path: "cart.product",
        model: "Product",
      });
  
      console.log("newOrder", order);
  
      return order;
    } catch (error) {
      console.error(error);
      return res.status(500).send("Problem getting order..");
    }
  };

const sendOrderConfirmationEmail = (order) => {
    console.log('***** sendBuyerEmail called', order)  
    if(!order?.deliveryAddress.email) return;

  const mailOptions = {
        from: `REMU <kkwilson852@gmail.com>`,
        to: `${order.deliveryAddress.email}`,
        subject: `Your Order No. #${order._id}`, 

        html: `
        <p>Dear ${order.deliveryAddress.firstName},<br>
        We are pleased to inform you that your order for ${order.deliveryAddress.firstName}
        ${order.deliveryAddress.lastName}
        was successfully placed.<br>We look forward to serving you again soon.<br> Kind regards,<br> Wannet Global, Inc.</p>,
        `
      };    


      // ' placed on ' + moment.tz(order.created_on, 'America/Toronto').format('MM-DD-YYYY') + 

    try {
      nodemailer.sendEmail(mailOptions);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Problem sending order confirmation..");
    }
}