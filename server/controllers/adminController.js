// controllers/adminController.js
const Logsheet = require("../models/LogSheet");

exports.getPendingLogsheets = async (req, res) => {
  const pending = await Logsheet.find({ status: 'Pending' }).populate('userId', 'email');
  res.json(pending);
};
exports.updateLogsheetStatus = async (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body;
  const logsheet = await Logsheet.findById(id);
  if (!logsheet) return res.status(404).json({ error: 'Not found' });
  logsheet.status = status;
  logsheet.reviewedBy = req.user.userId;
  if (status === 'Rejected') logsheet.rejectionReason = rejectionReason;
  await logsheet.save();
  res.json({ message: `Logsheet ${status}` });
};
