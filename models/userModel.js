const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  
  firstName: {
    type: String,
  },

  lastName: {
    type: String,
  },

  email: {
    type: String,
    required: false,
    unique: true
  },

  password: {
    type: String,
  },

  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
    }
  ],

  isVerified: { 
    type: Boolean, 
    default: false 
  },

  userFrom:{
    type: String 
  },
  
  resetPasswordToken: { 
    type: String 
  },

  resetPasswordExpires: { 
    type: Date 
  },
  lastEmailUpdate: {
    type: Date
  },
  
  verificationToken: String,

  verificationTokenExpires: Date,
  
  lastResend: Date,
  
}, {
  timestamps: true,
});

module.exports = mongoose.model("User", userSchema);