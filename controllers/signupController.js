const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const signUpChecks = async (req, res) => {
  const { invitedCode, username, firstName, lastName, email, password } = req.body;

  if (!invitedCode || !username || !firstName || !lastName || !email || !password) {
      throw new Error("All fields are required");
    }
  
  const allowedInvitedCode = process.env.INVITED_CODE;
  
  if (invitedCode !== allowedInvitedCode) {
      throw new Error("Invalid invitedCode");
    }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "Username already taken" });
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({ message: "This Email is already taken" });
  }

  const emailLocalPart = email.split("@")[0];
  if (emailLocalPart.includes("+")) {
    return res.status(400).json({ message: "We don't accept email containing '+'" });
  }

  const [emailLocalsPart, emailDomain] = email.split("@");

  if (password.length < 10 || password.includes(emailLocalsPart) || password.includes(emailDomain)) {
    return res.status(400).json({ message: "Password length must be at least 10 characters and must not contain your email" });
  }

  try {

    const response = await axios.request(mailCheckOptions);
    const isValidEmail = response.data.valid;

    if (!isValidEmail) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Proceed with user creation if email is valid
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      notes: [],
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = signUpChecks;
