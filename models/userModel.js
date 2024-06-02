const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  
  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
      required: true
    }
  ],

  isVerified: { 
    type: Boolean, 
    default: false 
  },

  verificationToken: String,

  verificationTokenExpires: Date,
  
  lastResend: Date 
  
}, {
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);