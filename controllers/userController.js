require("dotenv").config();
const User = require("../models/userModel");
const signUpChecks = require("./signupController");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {

    await signUpChecks(req, res);
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

   try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.status(200).json({ message: "Login successful", token });

  } catch (err) {

    console.error("Error:", err);
    res.status(500).json({ message: "Server error." });

  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  // Validate request body
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    // Find the user by ID and populate the notes field
    const user = await User.findById(userId).populate("notes");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).send({ username: user.username, userNotes: user.notes });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


module.exports = {
  createUser,
  loginUser,
  getUserById,
};