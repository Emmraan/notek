const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const hostDomain = process.env.DOMAIN;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const updateChecks = async (req, res) => {
  const { firstName, lastName, email, current_password, new_password } = req.body;

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpires = Date.now() + 86400000; // 24 hours

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).redirect(`/user/account?error=User not found`);
    }

    // Check if email update is allowed
    if (email && email !== user.email) {
      const lastEmailUpdate = user.lastEmailUpdate || 0;
      const currentTime = Date.now();
      const timeSinceLastUpdate = currentTime - lastEmailUpdate;
      const emailUpdateInterval = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

      if (timeSinceLastUpdate < emailUpdateInterval) {
        const remainingTime = emailUpdateInterval - timeSinceLastUpdate;
        const remainingDays = Math.ceil(remainingTime / (24 * 60 * 60 * 1000));
        return res.status(400).redirect(`/user/account?error=You can only update your email once every 14 days. Please try again in ${remainingDays} days.`);
      }
    }

    const acceptedDomains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com"];
    const getEmailDomain = (email) => {
      return email.substring(email.lastIndexOf("@") + 1);
    }

    const domain = getEmailDomain(email);
    if (!acceptedDomains.includes(domain)) {
      return res.status(400).redirect(`/user/account?error=We accept emails only from these domains: ${acceptedDomains.join(", ")}`);
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email: { $eq: email } });
      if (existingEmail) {
        return res.status(400).redirect("/user/account?error=This email is already taken");
      }

      const emailLocalPart = email.split("@")[0];
      if (emailLocalPart.includes("+")) {
        return res.status(400).redirect("/user/account?error=We don't accept email containing plus before @");
      }

      user.email = email;
      user.isVerified = false; // Set isVerified to false only when email changes
      user.verificationToken  = verificationToken;
      user.verificationTokenExpires = verificationTokenExpires;
      // Set the lastEmailUpdate timestamp to the current time
      user.lastEmailUpdate = Date.now();
    }

    if (new_password) {
      if (!current_password) {
        return res.status(400).redirect("/user/account?error=Current password is required to set a new password");
      }

      const isMatch = await bcrypt.compare(current_password, user.password);
      if (!isMatch) {
        return res.status(400).redirect("/user/account?error=Current password is incorrect");
      }

      if (new_password.length < 10 || new_password.includes(email.split("@")[0]) || new_password.includes(email.split("@")[1])) {
        return res.status(400).redirect("/user/account?error=Password length must be at least 10 characters and must not contain your email");
      }

      user.password = await bcrypt.hash(new_password, 10);
    }

    if (firstName && firstName !== user.firstName) {
      user.firstName = firstName;
    }

    if (lastName && lastName !== user.lastName) {
      user.lastName = lastName;
    }

    await user.save();

    // Generate verification token and send email only when email changes
    if (email && email !== req.user.email) {
      const verificationLink = `${hostDomain}/user/verify-email?token=${verificationToken}`;
      const mailOptions = {
        from: process.env.USER,
        to: email,
        subject: "Email Verification",
        text: `Please verify your email by copy and paste it in browser: ${verificationLink}`
      };
      await transporter.sendMail(mailOptions);
      return res.status(201).render("emailVerify", {
        message: "Please check your Email for verification Link."
      });
    }

    return res.status(200).redirect("/user/account"); 
  } catch (err) {
    console.error(err);
    res.status(500).redirect("/user/account?error=Internal server error");
  }
};


module.exports = updateChecks;