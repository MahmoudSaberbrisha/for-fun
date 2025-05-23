const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema(
  {
    boardCode: {
      type: String,
      required: true,
      unique: true,
    },
    startDateHijri: {
      type: String,
      required: true,
    },
    startDateGregorian: {
      type: Date,
      required: true,
    },
    appointmentDecisionNumber: {
      type: String,
      required: true,
    },
    endDateHijri: {
      type: String,
      required: true,
    },
    endDateGregorian: {
      type: Date,
      required: true,
    },
    decisionImage: {
      type: String, // store image path or URL
      required: true,
    },
    boardStatus: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: false,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Member",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", BoardSchema);
