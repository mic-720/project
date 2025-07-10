const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

exports.registerUsers = async (req, res) => {
  try {
    const users = req.body.users;
    if (!users || !Array.isArray(users))
      return res.status(400).json({ error: "Invalid input" });

    for (const user of users) {
      if (!user.email) continue;
      const existing = await User.findOne({ email: user.email });
      if (existing) continue;

      const password = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        email: user.email,
        password: hashedPassword,
        isAdmin: !!user.isAdmin,
      });

      const emailBody = `
        Welcome to the Logsheet Management System!

        Your login credentials are as follows:
        UserID: ${user.email}
        Password: ${password}

        You can access the portal here:
        https://v0-logsheet-management-system-desig.vercel.app

        Please log in and change your password as soon as possible.
      `;

      await sendEmail(
        user.email,
        "Your Logsheet Portal Credentials",
        emailBody
      );
    }

    res.json({ message: "Users created and emailed where applicable" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
