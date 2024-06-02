require("dotenv").config();
const User = require("../models/userModel");
const {signUpChecks,verifyEmail} = require("./signupController");
const updateChecks  = require("./updateController");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {

    await signUpChecks(req, res);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {

    await updateChecks(req, res);
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).redirect("/login?error=Email and password are required.");
  }

  try {
    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).redirect("/login?error=Email or password are incorrect.");
    }
   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).redirect("/login?error=Email or password are incorrect.");
    }

    const token = jwt.sign({ id: user._id, email: user.email}, process.env.JWT_SECRET);

    res.cookie('authen', token, { 
      httpOnly: true, 
      secure: true, 
      expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), 
      sameSite: 'strict'
    });

    return res.redirect("/");

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).redirect("/login?error=Server error.");
  }
};

const logoutUser = async (req, res) => {
  try {
    
    res.clearCookie('authen');

    res.redirect("/");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error." });
  }
};

const getUser = async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).redirect("/");
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; 
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
  createUser,
  updateUser,
  loginUser,
  logoutUser,
  getUser,
};