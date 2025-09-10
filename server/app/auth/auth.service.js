require("../user/user.model");
require("../cart/cart.model");


const User = require("mongoose").model("User");
const Cart = require("mongoose").model("Cart");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ObjectId = require("mongoose").Types.ObjectId;

const isEmail = require("validator/lib/isEmail");
const isLength = require("validator/lib/isLength");

exports.signIn = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    console.log('firstName', firstName);
    console.log('lastName', lastName);
    console.log('email', email);
    console.log('password', password);

    const authData = { firstName, lastName, email, password };

    try {

    let user = await User.findOne({
      email,
    }).select("+password");
    console.log("user", user);

    if (!user) {
      return res.status(422).send("User with this credential does not exist.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log("passwordMatch", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).send("Invalid signin credentials.");
    }

    delete user.password;

    const token = getToken(user._id);

    await User.updateOne(
      { user: new ObjectId(new ObjectId(user._id)) },
      { $set: { token } }
    );

    console.log('user with saved token', user);

    const auth = {
      _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        token: user.token
    }

    const cart = await getUserCart(res, user._id)
    console.log('cart', cart)

    return res.status(201).json({auth, cart});
    } catch (error) {
        res.status(500).send("Problem signing in user!");
        console.log(error);
      }

}

exports.signUp = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    console.log('firstName', firstName);
    console.log('lastName', lastName);
    console.log('email', email);
    console.log('password', password);

    const authData = { firstName, lastName, email, password };

    try {
        if (
            !isLength(password, {
              min: 6,
            })
          ) {
            return res.status(422).send("Password must be minimum of 6 characters.");
          } else if (!isEmail(email)) {
            return res.status(422).send("Invalid email.");
          }

          let existingUser = await User.findOne({
            email,
          });
      
          console.log("existingUser", existingUser);
      
          if (existingUser) {
            return res.status(422).send("User with this credential already exists.");
          }

        const newUser = new User(authData);
        newUser.password = bcrypt.hashSync(authData.password, 10);
        newUser.token = getToken(newUser._id);
        console.log('newUser.token', newUser.token);
        await newUser.save();
        delete newUser.password;

        // const token = getToken(newUser._id);

        const newCart = new Cart({ user: newUser._id, cart: [] });
        await newCart.save();

        console.log("newUser", newUser);
        console.log("newCart", newCart);

        const auth = {
          _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            token: newUser.token,
        }

        return res.status(201).json({auth, cart: newCart});
    } catch (error) {
        res.status(500).send("Problem signing up user!");
        console.log(error);
      }

}

exports.signOut = async (req, res) => {
  const { userId} = req.body;

  try {
    await User.updateOne(
      { _id: new ObjectId(new ObjectId(userId)) },
      { $set: { token: '' } }
    );
  } catch (error) {
    res.status(500).send("Problem signing out user!");
    console.log(error);
  }

}



const getToken = (userId) => {
    let token = jwt.sign(
      {
        userId: userId
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "20m",
      }
    );
  
    return token;
  }
  

const getUserCart = async (res, user) => {
  try {
    const cart =  await Cart.findOne({ user: new ObjectId(user._id) })
    .populate({ path: "cart.product", model: "Product" });
  console.log('cart.cart', cart.cart)
  return cart.cart;
  } catch (error) {
    res.status(500).send("getUserCart: Problem getting user's cart!");
    console.log(error);
  }
  
}
