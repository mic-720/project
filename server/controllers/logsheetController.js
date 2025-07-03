const Logsheet = require("../models/LogSheet");

const { Parser } = require("json2csv");

exports.submitLogsheet = async (req, res) => {
  try {
    const newLogsheet = new Logsheet({
      userId: req.user.userId,
      data: req.body,
    });
    await newLogsheet.save();
    res.status(201).json({ message: "Logsheet submitted" });
  } catch (err) {
    console.error("Submit logsheet error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getMyLogsheets = async (req, res) => {
  try {
    const logsheets = await Logsheet.find({ userId: req.user.userId }).populate(
      {
        path: "reviewedBy",
        select: "name email", // adjust fields as per your model
      }
    );

    res.json(logsheets);
  } catch (err) {
    console.error("Fetch logsheets error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.exportMyLogsheetsCSV = async (req, res) => {
  try {
    const logsheets = await Logsheet.find({ userId: req.user.userId });
    const plainData = logsheets.map((log) => ({
      assetCode: log.data.assetCode,
      operator: log.data.operatorName,
      date: log.data.date,
      status: log.status,
      submittedAt: log.submittedAt,
    }));

    const parser = new Parser();
    const csv = parser.parse(plainData);
    res.header("Content-Type", "text/csv");
    res.attachment("logsheets.csv");
    return res.send(csv);
  } catch (err) {
    console.error("CSV export error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
