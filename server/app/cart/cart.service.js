const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

require("./cart.model");

const Cart = require("mongoose").model("Cart");

exports.saveCart = async (req, res) => {
    
    const cart = req.body;
    console.log('cart', cart)
  
    const token = req.headers.authorization?.split(" ")[1];
  
    console.log('token', token)
  
    try {
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);
  
      if(!userId) {
        return res.status(422).send(`You must be logged in to save your cart.`)
    }

    await Cart.updateOne(
      { user: userId },
      { $set: { cart } }
    );
  
      res.status(201).json({message: 'Cart saved successfully'});
    } catch (error) {
      return res.status(500).send("You must be logged in to save your cart.");
      
      // throw error;
    }
  };
  


