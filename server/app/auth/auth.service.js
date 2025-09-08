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

    const token = getToken(user._id);

    const auth = {
      _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        token,
    }

    const cart = await getUserCart(user._id)
    console.log('cart', cart)

    return res.status(201).json({auth, cart});
    } catch (error) {
        res.status(500).send("Problem signing in user!");
        // throw error;
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
        await newUser.save();
        delete newUser.password;

        const token = getToken(newUser._id);

        const newCart = new Cart({ user: newUser._id, cart: [] });
        await newCart.save();

        console.log("newUser", newUser);
        console.log("newCart", newCart);

        const auth = {
          _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            token,
        }

        return res.status(201).json({auth, cart: newCart.cart});
    } catch (error) {
        res.status(500).send("Problem signing up user!");
        // throw error;
      }

}

const getToken = (userId) => {
    let token = jwt.sign(
      {
        userId: userId
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1m",
      }
    );
  
    return token;
  }


  const getUserCart = async (user) => {
    try {
      const cart =  await Cart.findOne({ user: new ObjectId(user._id) })
      .populate({ path: "cart.product", model: "Product" });
    console.log('cart.cart', cart.cart)
    return cart.cart;
    } catch (error) {
      res.status(500).send("getUserCart: Problem getting user's cart!");
      // throw error;
    }
    
  }

  // logout route
const signOut = (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const decoded = jwt.decode(token);
    const exp = decoded.exp;
    // store token in Redis until it expires
    redis.set(token, "revoked", "EX", exp - Math.floor(Date.now() / 1000));
  }
  res.sendStatus(200);
};

// middleware to check tokens
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  // Check blacklist
  redis.get(token, (err, data) => {
    if (data) return res.sendStatus(401); // revoked
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch {
      return res.sendStatus(403);
    }
  });
};
