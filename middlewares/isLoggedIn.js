require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");

const authUser = async (req, res, next) => {
  try {
    let token = req.headers['authorization'];

    if (token && token.startsWith('Bearer ')) {
      token = token.split(' ')[1]; 
    }

    if (!token && req.cookies.authen) {
      token = req.cookies.authen;
    }

    if (!token) {
     return res.status(401).redirect("/");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
     return res.status(401).redirect("/");
    }

    req.user = user; 
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    return res.status(401).redirect("/");
  }
};

module.exports = authUser;