const Note = require("../models/noteModel");
const User = require("../models/userModel");

const createNote = async (req, res) => {
  const { title, body } = req.body;
  const userId = req.user.id; 

  // Validate request body
  if (!title || !body) {
    return res.status(400).json({ message: "Title and body are required." });
  }

  try {
    // Fetch the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create a new note
    const note = new Note({
      title,
      body,
      user: user._id,
    });

    // Save the note to the database
    const newNote = await note.save();

    // Update the user's notes array
    user.notes.push(newNote._id);
    await user.save();

    res.status(201).json(newNote);
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

const readNote = async (req, res) => {
  const noteId = req.params.noteId; // Assuming note ID is in params

  try {
    // Find the note
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    res.status(200).json(note);
  } catch (err) {
    console.error("Error retrieving note:", err);
    res.status(500).json({ message: "Server error." });
  }
};

const updateNote = async (req, res) => {
  const { title, body } = req.body;
  const userId = req.user.id; 
  const noteId = req.params.noteId;

  if (!title || !body) {
    return res.status(400).json({ message: "Title and body are required." });
  }

  try {
    
    const note = await Note.findOne({ _id: noteId, user: userId });
    if (!note) {
      return res.status(404).json({ message: "Note not found or you don't have permission." });
    }

    note.title = title;
    note.body = body;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ message: "Server error." });
  }
};

const deleteNote = async (req, res) => {
  const userId = req.user.id; // Get user ID from authenticated user
  const noteId = req.params.noteId; // Get note ID from params

  try {
    // Find and delete the note if it belongs to the user
    const deletedNote = await Note.findOneAndDelete({ _id: noteId, user: userId }); 
    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found or you don't have permission." });
    }

    // Update the user's notes array
    await User.findByIdAndUpdate(userId, { $pull: { notes: noteId } }); // Remove noteId from user's notes

    res.status(200).json({ message: "Note deleted successfully.", deletedNote });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ message: "Server error." });
  }
};

const allNotes = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" }); 
    }

    const notes = await Note.find({ user: req.user.id });

    res.status(200).json(notes); 
  } catch (err) {
    console.error("Error retrieving notes:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createNote,
  readNote,
  updateNote,
  deleteNote,
  allNotes
};