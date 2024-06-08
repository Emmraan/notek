const express = require("express");
const { allNotes, getUser } = require("../controllers/exportAllControllers");
const userAuthen = require("../middlewares/userAuthen");


const Router = express.Router();

Router.get("/",userAuthen, getUser, allNotes, (req, res) => {

  res.render("homeLogIn", { user: req.user, notes: req.notes });

});

module.exports = Router;