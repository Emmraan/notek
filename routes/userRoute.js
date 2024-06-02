const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const userAuthen = require("../middlewares/userAuthen.js");
const { createUser, updateUser, loginUser, logoutUser, getUser } = require("../controllers/exportAllControllers");
const { verifyEmail, resendLink } = require("../controllers/signupController");

const Router = express.Router();

Router.post("/register", createUser)

      .get("/verify-email",isLoggedIn, verifyEmail)

      .get("/resend-link", isLoggedIn, resendLink)

      .post("/login", loginUser)

      .get("/account", isLoggedIn, userAuthen, getUser, (req, res) => {
          res.render("userInfo", { user: req.user });
      })

      .post("/update", isLoggedIn, updateUser)

      .get("/logout", isLoggedIn, logoutUser)

module.exports = Router;