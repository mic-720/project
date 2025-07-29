const Logsheet = require("../models/LogSheet");

const { Parser } = require("json2csv");

exports.submitLogsheet = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : null;

    const newLogsheet = new Logsheet({
      userId: req.user.userId,
      data: {
        ...req.body,
        imageUrl,
      },
    });

    console.log(newLogsheet);

    await newLogsheet.save();
    res.status(201).json({ message: "Logsheet submitted", imageUrl });
  } catch (err) {
    console.error("Submit logsheet error:", err.message);
    console.error("Full error:", JSON.stringify(err, null, 2));

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

exports.getAllLogsheets = async (req, res) => {
  try {
    const logsheets = await Logsheet.find().populate("userId"); // populate if you want user details too
    res.status(200).json({ success: true, data: logsheets });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch logsheets",
      error: err.message,
    });
  }
};

exports.exportAllLogsheetsCSVAdmin = async (req, res) => {
  try {
    const logsheets = await Logsheet.find().populate("userId");

    const formatted = logsheets.map((entry) => {
      const d = entry.data;
      return {
        userName: d.userInfo.userName,
        email: entry.userId?.email || "",
        date: d.date,
        assetCode: d.assetCode,
        assetDescription: d.assetDescription,
        operatorName: d.operatorName,
        activityCode: d.productionDetails.activityCode,
        quantityProduced: d.productionDetails.quantityProduced,
        workDone: d.productionDetails.workDone,
        workingHours: d.totals.workingHours,
        idleHours: d.totals.idleHours,
        breakdownHours: d.totals.breakdownHours,
        fuelInLiters: d.totals.fuelInLiters,
        hmrOrKmrRun: d.totals.hmrOrKmrRun,
        status: entry.status,
        rejectionReason: entry.rejectionReason || "",
      };
    });

    const parser = new Parser();
    const csv = parser.parse(formatted);

    res.header("Content-Type", "text/csv");
    res.attachment("all_logsheets.csv");
    return res.send(csv);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to export CSV",
      error: err.message,
    });
  }
};
