const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    default: "Absent",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
