require('dotenv').config();
const Note = require("../models/noteModel");
const User = require("../models/userModel");
const { encrypt,decrypt  } = require("../utils/noteEncryption");

const createNote = async (req, res) => {
  const { title, body } = req.body;
  const userId = req.user.id; 
  const encryptionKey = Buffer.from(process.env.NOTE_SECRET, 'hex');

  if (!title || !body) {
    return res.redirect("/");
  }

  try {
    const user = await User.findById(userId);

    // Encrypt the note title and body before saving
    const encryptedTitle = encrypt(title, encryptionKey);
    const encryptedBody = encrypt(body, encryptionKey);

    const note = new Note({
      title: encryptedTitle,
      body: encryptedBody,
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

    // Decrypt the existing encrypted title and body
    const [ivTitle, encryptedTitle] = note.title.split(':');
    const [ivBody, encryptedBody] = note.body.split(':');
    const encryptionKey = Buffer.from(process.env.NOTE_SECRET, 'hex');

    const decryptedTitle = decrypt(encryptedTitle, encryptionKey, ivTitle);
    const decryptedBody = decrypt(encryptedBody, encryptionKey, ivBody);

    // If the title or body has been changed, encrypt the new values
    const newEncryptedTitle = title !== decryptedTitle ? encrypt(title, encryptionKey) : note.title;
    const newEncryptedBody = body !== decryptedBody ? encrypt(body, encryptionKey) : note.body;

    // Update the note with the new encrypted values
    note.title = newEncryptedTitle;
    note.body = newEncryptedBody;

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

    const encryptionKey = Buffer.from(process.env.NOTE_SECRET, 'hex');
    
    const notes = await Note.find({ user: req.user.id });

    const decryptedNotes = notes.map(note => {
      const [iv, encryptedData] = note.title.split(':');
      const decryptedTitle = decrypt(encryptedData, encryptionKey, iv);
    
      // Similarly decrypt the body
      const [ivBody, encryptedBody] = note.body.split(':');
      const decryptedBody = decrypt(encryptedBody, encryptionKey, ivBody);
    
      return {
        ...note.toObject(),
        title: decryptedTitle,
        body: decryptedBody
      };
    });

    req.notes = decryptedNotes.reverse();
    next();
  } catch (err) {
    console.error('Error retrieving notes:', err);
    res.status(500).json({ message: 'Error retrieving notes.' });
  }
};



module.exports = {
  createNote,
  updateNote,
  deleteNote,
  allNotes
};