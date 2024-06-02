require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");

const isLoggedOut = async (req, res, next) => {
    try {
      let token = req.headers['authorization'];
  
      if (token && token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
      }
  
      if (!token && req.cookies.authen) {
        token = req.cookies.authen;
      }
  
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
  
        if (user) {
          return res.redirect("/"); 
        }
      }
  
      next(); 
    } catch (err) {
      console.error('Token verification error:', err.message);
      next();
    }
  };
  
module.exports = isLoggedOut;
