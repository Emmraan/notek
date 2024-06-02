require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../models/userModel");

const hostDomain = process.env.DOMAIN;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const signUpChecks = async (req, res) => {
  try {

    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {

      return res.status(400).redirect("/register?error=All fields are required");

    }

    const acceptedDomains = ["gmail.com","hotmail.com","outlook.com","yahoo.com",];

    const getEmailDomain = (email) => {

      email.substring(email.lastIndexOf("@") + 1);
      
    } 
      
      

    const domain = getEmailDomain(email);

    if (!acceptedDomains.includes(domain)) {

      return res.status(400).redirect(`/register?error=We accept emails only from these domains: ${acceptedDomains.join(", ")}`);

    }



    const existingEmail = await User.findOne({ email });
    if (existingEmail) {

      return res.status(400).redirect("/register?error=This Email is already taken");

    }



    const emailLocalPart = email.split("@")[0];

    if (emailLocalPart.includes("+")) {

      return res.status(400).redirect("/register?error=Sorry We don't accept emails containing plus before @");

    }

    if (password.length < 10 ||password.includes(emailLocalPart) || password.includes(domain) ){

      return res.status(400).redirect("/register?error=Password length must be at least 10 characters and must not contain your email local part or domain");
    }




    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = Date.now() + 86400000; // 24 hours

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
    });

    const user = await newUser.save();

    const verificationLink = `${hostDomain}/user/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: "Email Verification",
      text: `Please verify your email by copy and paste it in browser: ${verificationLink}`
    };



    const token = jwt.sign({ id: user._id, email: user.email },process.env.JWT_SECRET);

    res.cookie("authen", token, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
      sameSite: "strict",
    });




    transporter.sendMail(mailOptions, (error, info) => {

      if (error) {

        return res.status(500).redirect("/register?error=Failed to send verification email");
      }

        return res.status(201).render("emailVerify", {

          message:"Successfully Registration Please check your Email for verification Link."

        });
    });

  } catch (error) {

    console.error(error);

    res.status(500).redirect("/register?error=Internal Server Error");

  }

};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(401).render("emailVerify", {
        error: "Verification token is invalid or has expired",
        message: null,
        redirectMessage: null,
      });
    }



    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });



    if (!user) {
      return res.status(401).render("emailVerify", {
        error: "User not found or verification token has expired",
        message: null,
        redirectMessage: null,
      });
    }



    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    return res.status(401).render("emailVerify", {
      redirectMessage: "Your Email verify successfully !",
      error: null,
      message:null
    });

  } catch (error) {
    console.error("Error verifying email:", error);
    return res.redirect("/");
  }
};

const resendLink = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).render("emailVerify", {
        error: "User not found",
        message: null,
        redirectMessage: null,
      });
    }

    if (user.isVerified) {
      return res.status(401).render("emailVerify", {
        error: "Email is already verified",
        message: null,
        redirectMessage: null,
      });
    }

    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (user.lastResend && now - user.lastResend.getTime() < oneDay) {
      const waitTime = oneDay - (now - user.lastResend.getTime());
      const hoursLeft = Math.ceil(waitTime / (60 * 60 * 1000));
      return res.status(401).render("emailVerify", {
        error: `You can request a new link in ${hoursLeft} hours`,
        message: null,
        redirectMessage: null,
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = Date.now() + 86400000; // 24 hours

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    user.lastResend = new Date(now);

    await user.save();

    const verificationLink = `${hostDomain}/user/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.USER,
      to: user.email,
      subject: "Email Verification",
      text: `Please verify your email by copy and paste it in browser: ${verificationLink}`,
    };


    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).render("emailVerify", {
          error: "Failed to send verification email",
          message: null,
          redirectMessage: null,
        });
      }
      
      return res.status(200).render("emailVerify", {
        error: null,
        redirectMessage: null,
        message: "Verification email resent successfully",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/");
  }
};


module.exports = { signUpChecks, verifyEmail, resendLink };