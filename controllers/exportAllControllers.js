const { createUser,updateUser, loginUser,logoutUser,getUser,verifyLogin } = require("./userController");
const { createNote,updateNote,deleteNote,allNotes } = require("./noteController");

module.exports = {
  createUser,
  updateUser,
  loginUser,
  logoutUser,
  createNote,
  getUser,
  updateNote,
  deleteNote,
  allNotes,
  verifyLogin,
};