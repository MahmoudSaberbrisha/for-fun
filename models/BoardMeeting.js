const mongoose = require("mongoose");

const boardMeetingSchema = new mongoose.Schema({
  sessionNumber: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  secretary: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Open", "Closed"],
    default: "Open",
  },
  topics: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
    },
  ],
  votingItems: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      votes: [{ type: String, enum: ["yes", "no"] }],
      followUpStatus: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending",
      },
      followUpNotes: {
        type: String,
        default: "",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BoardMeeting", boardMeetingSchema);
