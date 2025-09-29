require("../user/user.model");
require("./cart.model");

const User = require("mongoose").model("User");
const ObjectId = require("mongoose").Types.ObjectId;
const Cart = require("mongoose").model("Cart");

exports.getCart = async (req, res) => {
  try {
    const user = req.query.user  
    console.log('user', user)
    const cart = await Cart.findOne({user: new ObjectId(user)})
    .populate({ path: "cart.product", model: "Product" });
    res.status(200).json(cart);
    
  } catch(error) {
    console.log(error);
    return res.status(500).send('Error retrieving cart');
  }
}

exports.saveCart = async (req, res) => {
    
    const cartModel = req.body;
    console.log('saveModel.cartModel', cartModel)
    
  
    const token = req.headers.authorization?.split(" ")[1];    
  
    try {
      const user = await User.findById({_id: cartModel.user});

      console.log('user.token', user.token);
      console.log('token', token);


      if (user?.token !== token) {
        return res.status(422).send(`Your login may have expired. Please sign in.`);
      }

      await Cart.updateOne(
        { user: new ObjectId(new ObjectId(cartModel.user)) },
        { $set: { cart:cartModel.cart } }
      );


      const retCart = await Cart.findOne({user: new ObjectId(cartModel.user)})
      .populate({ path: "cart.product", model: "Product" });
      console.log('retCart', retCart);
  
      res.status(201).json(retCart.cart);
    } catch (error) {
      console.log(error);
      return res.status(500).send("You must be logged in to save your cart.");
      
      
    }
  };
  


