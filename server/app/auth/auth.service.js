require("../user/user.model");
require("../cart/cart.model");


const User = require("mongoose").model("User");
const Cart = require("mongoose").model("Cart");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { toInt } = require("validator");
const ObjectId = require("mongoose").Types.ObjectId;
const nodemailer = require('../util/email/nodemailer.service');

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

      user.token = token;
      await user.save();

      delete user.password;

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
        await newUser.save();

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

        return res.status(201).json({auth, cart: newCart.cart});
    } catch (error) {
        res.status(500).send("Problem signing up user!");
        console.log(error);
      }

}

exports.signOut = async (req, res) => {
  console.log('AuthService.signOut');
  const { userId} = req.body;

  try {
    await User.updateOne(
      { _id: new ObjectId(new ObjectId(userId)) },
      { $set: { token: '' } }
    );

    return res.status(201).json({message: "You have successfully signed out."});
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


exports.getVerificationCode = async (req, res) => {
  console.log('AuthService.getVerificationCode');
  const authData = JSON.parse(req.query.authData);
  console.log('authData', authData);
  const {email, phone} = authData;
    console.log('email', email);
    console.log('phone', phone);

    try {

      let existingUser = await User.findOne({
        email,
      });
  
      console.log("existingUser", existingUser);
  
      if (!existingUser) {
        return res.status(422).send("There is a problem with the information provided.");
      }
      
      let verificationCode = Math.floor((Math.random() * (9999 - 1000) + 1000));
      verificationCode = verificationCode.toString();

      console.log('verificationCode', verificationCode)

      sendVerificationCodeEmail(verificationCode, email, res);

      return res.status(201).json(verificationCode);
    } catch (error) {
        res.status(500).send("Problem sending verification code!");
        console.log(error);
      }
}


const sendVerificationCodeEmail = (code, email, res) => {

const mailOptions = {
      from: `REMU <kkwilson852@gmail.com>`,
      to: `${email}`,
      subject: `Verification Code`, 

      html: `
      <h2>Verification Code: ${code}</h2>
      <p>Please enter the verification code into the space provided on your screen.</p>
      <p>This code will expire in 10 minutes.</p>
      `
    };    


  try {
    nodemailer.sendEmail(mailOptions);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Problem sending order confirmation..");
  }
}