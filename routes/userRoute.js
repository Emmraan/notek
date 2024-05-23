const express = require("express");
const authenticator = require("../middlewares/authUser")
const { createUser,loginUser,getUserById } = require("../controllers/exportAllControllers");

const Router = express.Router();

Router.post("/register", createUser)

      .post("/login", loginUser)

      .get("/:userId", getUserById);

module.exports = Router; 