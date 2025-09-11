require("../user/user.model");
const User = require("mongoose").model("User");

const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const { getUserIdFromToken } = require("../auth/auth.service");

require("./cart.model");

const Cart = require("mongoose").model("Cart");

exports.saveCart = async (req, res) => {
    
    const cart = req.body;
    // console.log('cart', cart)
  
    const token = req.headers.authorization?.split(" ")[1];    
  
    try {
      const user = await User.findById({_id: cart.user});

      console.log('user.token', user.token);
      console.log('token', token);


      if (user?.token !== token) {
        return res.status(422).send(`Your login may have expired. Please sign in.`);
      }

      await Cart.updateOne(
        { _id: new ObjectId(new ObjectId(cart.user)) },
        { $set: { cart:cart.cart } }
      );
  
      res.status(201).json({message: 'Cart saved successfully'});
    } catch (error) {
      console.log(error);
      return res.status(500).send("You must be logged in to save your cart.");
      
      
    }
  };
  


