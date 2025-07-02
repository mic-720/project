require("dotenv").config();
// In your terminal or MongoDB shell
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

const User = require("./models/User"); // adjust path if needed

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash("admin@123", 10); // or any secure password
  await User.create({
    email: "admin@gmail.com",
    password: hashedPassword,
    isAdmin: true,
  });
  console.log("Default admin created");
};
createAdmin();
