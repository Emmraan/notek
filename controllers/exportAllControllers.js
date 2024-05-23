const { createUser, loginUser,getUserById } = require("./userController");
const { createNote,updateNote,deleteNote,readNote,allNotes } = require("./noteController");

module.exports = {
  createUser,
  loginUser,
  createNote,
  getUserById,
  updateNote,
  deleteNote,
  readNote,
  allNotes
};
