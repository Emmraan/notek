const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const userAuthen = require("../middlewares/userAuthen");
const { createNote,updateNote,deleteNote} = require("../controllers/exportAllControllers");

const Router = express.Router();

Router.use(isLoggedIn,userAuthen);

Router
      
      .post("/create", createNote)

      .post("/update/:noteId", updateNote)

      .get("/delete/:index/:noteId", deleteNote)

module.exports = Router;