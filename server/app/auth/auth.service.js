require("../user/user.model");

const User = require("mongoose").model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const isEmail = require("validator/lib/isEmail");
const isLength = require("validator/lib/isLength");

exports.signIn = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    console.log('firstName', firstName);
    console.log('lastName', lastName);
    console.log('email', email);
    console.log('password', password);

    const authData = { firstName, lastName, email, password };

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

    return res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        token,
      });

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
    
        console.log("newUser", newUser);

        return res.status(201).json({
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            token,
          });
    } catch (error) {
        res.status(500).send("Problem signing up user!");
        throw error;
      }

}

const getToken = (userId) => {
    let token = jwt.sign(
      {
        userId: userId
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
  
    return token;
  }