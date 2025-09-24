const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

let res;

require("./order.model");
require("../product/product.model");

const Order = require("mongoose").model("Order");
const ObjectId = require("mongoose").Types.ObjectId;

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
      res.status(201).json(returnOrder);
    } catch (error) {
      console.log("error", error);
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

