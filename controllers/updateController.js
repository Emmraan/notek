const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const updateChecks = async (req, res) => {
    const { firstName, lastName, email, current_password, new_password } = req.body;
  
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
    
      if (new_password) {
        if (!current_password) {
          return res.status(400).json({ message: "Current password is required to set a new password" });
        }
        
        const isMatch = await bcrypt.compare(current_password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Current password is incorrect" });
        }
        
        if (new_password.length < 10 || new_password.includes(email.split("@")[0]) || new_password.includes(email.split("@")[1])) {
          return res.status(400).json({ message: "Password length must be at least 10 characters and must not contain your email" });
        }
  
        user.password = await bcrypt.hash(new_password, 10);
      }
  
  

      if (email && email !== user.email) {
        const existingEmail = await User.findOne({ email: { $eq: email } });
        if (existingEmail) {
          return res.status(400).json({ message: "This email is already taken" });
        }
  
        const emailLocalPart = email.split("@")[0];
        if (emailLocalPart.includes("+")) {
          return res.status(400).json({ message: "We don't accept email containing '+'" });
        }
        
        user.email = email;
      }
  

      if (firstName && firstName !== user.firstName) {
        user.firstName = firstName;
      }
  

      if (lastName && lastName !== user.lastName) {
        user.lastName = lastName;
      }
  
      await user.save();
  
      res.redirect("/user/account");
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
};
  
module.exports = updateChecks;
  
