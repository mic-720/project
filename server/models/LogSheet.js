const mongoose = require("mongoose");
const logsheetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // or "Admin", depending on your admin model
  },

  data: {
    assetCode: String,
    assetDescription: String,
    operatorName: String,
    date: String,
    workingDetails: {
      commenced: {
        time: String,
        hmrOrKmrReading: String,
      },
      completed: {
        time: String,
        hmrOrKmrReading: String,
      },
    },
    productionDetails: {
      activityCode: String,
      quantityProduced: Number,
      workDone: String,
    },
    totals: {
      workingHours: Number,
      idleHours: Number,
      breakdownHours: Number,
      productionQty: Number,
      hmrOrKmrRun: String,
      fuelInLiters: Number,
    },
    userInfo: {
      userName: String,
      userSignature: String,
    },
    imageUrl: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  rejectionReason: String,
  submittedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Logsheet", logsheetSchema);
