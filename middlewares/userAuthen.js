require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");

const userAuthen = async (req, res, next) => {
  try {
    let token = req.headers['authorization'];

    if (token && token.startsWith('Bearer ')) {
      token = token.split(' ')[1]; 
    }

    if (!token && req.cookies.authen) {
      token = req.cookies.authen;
    }

    if (!token) {
      return res.render("homeLogOut");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.render("homeLogOut");
    }

    req.user = user; 

    if (!user.isVerified) {
      return res.render("emailVerify", {
        error: "Your email is not verified. Please check your email for the verification link.",
        message: null
      });
    }

    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    return res.render("homeLogOut");
  }
};

module.exports = userAuthen;