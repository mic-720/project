const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
exports.registerUsers = async (req, res) => {
  const users = req.body.users;
  for (const user of users) {
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email: user.email, password: hashedPassword, isAdmin: user.isAdmin || false });
    await sendEmail(user.email, 'Logsheet Portal Credentials', `UserID: ${user.email}\nPassword: ${password}`);
  }
  res.json({ message: 'Users created and emailed' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
  res.json({ token });
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.userId);
  if (!(await bcrypt.compare(oldPassword, user.password))) {
    return res.status(400).json({ error: 'Old password is incorrect' });
  }
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password changed successfully' });
};