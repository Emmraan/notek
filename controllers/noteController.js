const Note = require("../models/noteModel");
const User = require("../models/userModel");

const createNote = async (req, res) => {
  const { title, body } = req.body;
  const userId = req.user.id; 

  if (!title || !body) {
    return res.redirect("/");
  }

  try {

    const user = await User.findById(userId);

    const note = new Note({
      title,
      body,
      user: user._id,
    });

    const newNote = await note.save();

    user.notes.push(newNote._id);

    await user.save();

    res.redirect("/");

  } catch (err) {
    console.error('Error creating note:', err);
    
    res.status(500).json({ message: 'Server error.' });
  }

};

const updateNote = async (req, res) => {
  const { title, body } = req.body;
  const userId = req.user.id; 
  const noteId = req.params.noteId;

  if (!title || !body) {
    return res.redirect("/");
  }

  try {
    
    const note = await Note.findOne({ _id: noteId, user: userId });
    if (!note) {
      return res.redirect("/");
    }

    note.title = title;
    note.body = body;

    await note.save();

    res.status(200).redirect("/");
  } catch (err) {

    console.error("Error updating note:", err);

    res.status(500).json({ message: "Server error." });
  }

};

const deleteNote = async (req, res) => {
  const userId = req.user.id; 
  const noteId = req.params.noteId; 

  try {
    // Delete the note
    const note = await Note.findOneAndDelete({ _id: noteId, user: userId });

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Remove the note ID from the user's notes field
    await User.findByIdAndUpdate(
      userId,
      { $pull: { notes: noteId } },
      { new: true }
    );

    res.status(200).redirect("/");

  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ message: "Server error." });
  }
};


const allNotes = async (req, res, next) => {
  try {

    const notes = await Note.find({ user: req.user.id });

    req.notes = notes.reverse(); 
    
    next(); 
    
  } catch (err) {

    res.status(500).json({ message: "error", err });
  }
};

module.exports = {
  createNote,
  updateNote,
  deleteNote,
  allNotes
};