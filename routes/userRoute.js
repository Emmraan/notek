const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const userAuthen = require("../middlewares/userAuthen");
const { createUser, updateUser, loginUser, logoutUser, getUser,verifyLogin } = require("../controllers/exportAllControllers");
const { verifyEmail, resendLink } = require("../controllers/signupController");
const { forgotPassword, resetPassword } = require("../controllers/resetPassController.js")

const Router = express.Router();

Router.post("/register", createUser)

      .get("/verify-email",isLoggedIn, verifyEmail)

      .get("/resend-link", isLoggedIn, resendLink)

      .post("/login", loginUser)

      .get("/verify-login", verifyLogin)

      .post("/forgot-password", forgotPassword, (req,res) => {
        res.render("resetPass")
      })

      .get("/reset-password", (req,res) => {
          const error = req.query.error || null;
          const token = req.query.token;
          res.render("resetPass",{ error: error, token:token })
      })
      
      .post("/reset-password", resetPassword, (req,res) => {
        res.render("resetPass")
      })

      .get("/account", isLoggedIn, userAuthen, getUser, (req, res) => {
         const error = req.query.error || null;
          res.render("userInfo", { user: req.user, error: error });
      })

      .post("/update", isLoggedIn, updateUser)

      .get("/logout", isLoggedIn, logoutUser)

module.exports = Router;