require("dotenv").config();
const User = require("../models/userModel");
const {signUpChecks} = require("./signupController");
const updateChecks  = require("./updateController");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const ipInfo = require("ipinfo")

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
  const userIp = req.headers['x-forwarded-for'] || req.ip;

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

    // New IP detected, trigger verification
    if (user.ip !== userIp) {
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpires = Date.now() + 3600000; // 1 hour
      user.verificationToken = verificationToken;
      user.verificationTokenExpires = verificationTokenExpires;
      user.ip = userIp; // Update the IP field with the new IP
      await user.save();

      // Geolocation lookup
     
      let locationInfo = {};

      try {
        locationInfo = await new Promise((resolve, reject) => {
          ipInfo(userIp, (err, cLoc) => {
            if (err) reject(err);
            resolve(cLoc);
          });
        });
      } catch (err) {
        console.error("Geolocation Error:", err);
        // Fallback values if geolocation fails
        locationInfo.country = "unknown country";
        locationInfo.city = "unknown city";
      }

      // Send verification email
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.USER,
          pass: process.env.PASS
        }
      });

      const verificationUrl = `${hostDomain}/user/verify-ip?token=${verificationToken}`;

      const mailOptions = {
        from: process.env.USER,
        to: user.email,
        subject: 'Security Alert!',
        text: `New sign-in detected with IP: ${userIp} from ${locationInfo.city}, ${locationInfo.region} ,${locationInfo.country}. If this was not you, change your password immediately. If this was you, please verify your new IP address by copying and pasting the following link into your browser: ${verificationUrl}`
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).redirect("/login?error=New IP detected! Check your email for an IP verification link.");
    } else {
      // IP is the same
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '6m' // Token expiration set to 6 months
      });

      res.cookie('authen', token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months
        sameSite: 'strict'
      });

      return res.redirect("/");
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).redirect("/login?error=Server error.");
  }
};


const verifyIp = async (req,res) => {
  const { token } = req.query;
  const userIp = req.headers['x-forwarded-for'] || req.ip;

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(401).send('Invalid or expired verification token');
  }

  // Update IP and clear verification token
  user.ip = userIp;
  user.verificationToken = null;
  user.verificationTokenExpires = null;
  await user.save();

  res.status(200).render("emailVerify",{
    ipMessage: "Your IP Verified Successful"
  });
}

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
  verifyIp
};