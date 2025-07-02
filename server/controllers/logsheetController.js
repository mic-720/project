const Logsheet = require("../models/LogSheet");

exports.submitLogsheet = async (req, res) => {
  const newLogsheet = new Logsheet({ userId: req.user.userId, data: req.body });
  await newLogsheet.save();
  res.status(201).json({ message: 'Logsheet submitted' });
};
exports.getMyLogsheets = async (req, res) => {
  const logsheets = await Logsheet.find({ userId: req.user.userId });
  res.json(logsheets);
};
