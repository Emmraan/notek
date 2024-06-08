require("dotenv").config();
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt")

const hostDomain = process.env.DOMAIN;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: { $eq: email } });

    if (!user) {
      return res.status(404).redirect("/login?error=User not found");
    }
    
    if (!email) {
      return res.status(404).redirect("/login?error=Email is requied !");
    }

    user.resetPasswordToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `${hostDomain}/user/reset-password?token=${user.resetPasswordToken}`;

    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: "Password Reset",
      text: `You requested for a password reset. Please use the following link to reset your password by copy and paste it in browser: ${resetLink}`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).render("emailVerify", {
      forgotMessage: "Password reset link has been sent to your email !"
    });

  } catch (err) {
    console.error(err);
    res.status(500).redirect("/login?error=Internal server error");
  }
};

const resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    const { token } = req.query;
  
    try {

      if (!token) {
        return res.status(400).render("emailVerify", {
            forgotMessage: "Password reset token is invalid or has expired"
        });
      }

      const user = await User.findOne({
        resetPasswordToken: { $eq: token },
        resetPasswordExpires: { $gt: Date.now() }
      });
    
      if (newPassword.length < 10) {
        return res.status(400).redirect("/user/reset-password?error=Password length must be at least 10 characters");
      }
  
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(400).render("emailVerify", {
        forgotSuccess: "Password has been reset successfully"
    });
  
    } catch (err) {
      return res.status(400).render("emailVerify", {
        forgotMessage: "Password reset token is invalid or has expired"
      });
    }
};


module.exports = {
    forgotPassword,
    resetPassword
};