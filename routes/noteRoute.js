const express = require("express");
const authenticator = require("../middlewares/authUser")
const { createNote,updateNote,deleteNote,readNote,allNotes } = require("../controllers/exportAllControllers");

const Router = express.Router();

Router.use(authenticator);

Router
      .get("/", allNotes)

      .post("/create", createNote)

      .get("/read/:noteId", readNote)

      .post("/update/:noteId", updateNote)

      .post("/delete/:noteId", deleteNote)

module.exports = Router;