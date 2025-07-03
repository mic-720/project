// controllers/adminController.js
const Logsheet = require("../models/LogSheet");

exports.getPendingLogsheets = async (req, res) => {
  try {
    const pending = await Logsheet.find({ status: "Pending" }).populate(
      "userId",
      "email"
    );
    res.json(pending);
  } catch (err) {
    console.error("Get pending logsheets error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateLogsheetStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const logsheet = await Logsheet.findById(id);
    if (!logsheet) return res.status(404).json({ error: "Logsheet not found" });

    logsheet.status = status;
    logsheet.reviewedBy = req.user.userId;
    logsheet.rejectionReason =
      status === "Rejected" ? rejectionReason : undefined;
    await logsheet.save();

    res.json({ message: `Logsheet ${status.toLowerCase()} successfully` });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
