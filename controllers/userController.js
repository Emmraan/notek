require("dotenv").config();
const User = require("../models/userModel");
const {signUpChecks} = require("./signupController");
const updateChecks  = require("./updateController");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

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
  const hostDomain = process.env.DOMAIN;
  const { email, password } = req.body;
  const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (!email || !password) {
    return res.status(400).redirect("/login?error=Email and password are required.");
  }

  try {
    const user = await User.findOne({ email: { $eq: email } });

    if (!user) {
      return res.status(401).redirect("/login?error=Email or password are incorrect.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).redirect("/login?error=Email or password are incorrect.");
    }

    // Check if verification token already exists
    if (user.verificationToken) {
      return res.status(200).render("emailVerify", {
        loginMessage: "New Login Detected! Check your email for New Login Verification Link."
      });
    }

    // New IP detected, trigger verification
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 3600000; // 1 hour
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS
      }
    });

    const verificationUrl = `${hostDomain}/user/verify-login?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.USER,
      to: user.email,
      subject: 'Security Alert!',
      text: `New sign-in detected with IP: ${userIp} If this was not you, change your password immediately. If this was you, please verify your new login by copying and pasting the following link into your browser: ${verificationUrl}`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).render("emailVerify", {
      loginMessage: "New Login Detected! Check your email for New Login Verification Link."
    });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).redirect("/login?error=Server error.");
  }
};

const verifyLogin = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({
      verificationToken: { $eq: token },
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(200).render("emailVerify", {
        ipMessage: "Invalid or expired Login verification token"
      });
    }

    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Create a JWT token
    const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);

    res.cookie("authen", jwtToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
      sameSite: "strict",
    });

    // Render the verification success page with a client-side redirect script
    res.status(200).render("emailVerify", {
      loginMessage: "Your New Login Verified Successfully. Redirecting to Home...",
      redirectUrl: "/"
    });
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
  verifyLogin
};