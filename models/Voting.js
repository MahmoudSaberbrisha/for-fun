const mongoose = require("mongoose");

const votingSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  options: [
    {
      optionText: String,
      votes: { type: Number, default: 0 },
    },
  ],
  status: {
    type: String,
    enum: ["Open", "Closed"],
    default: "Open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Voting", votingSchema);
