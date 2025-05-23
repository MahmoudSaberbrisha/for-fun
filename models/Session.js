const mongoose = require("mongoose");

const votingItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  votes: {
    type: [String], // array of 'yes' or 'no' strings
    default: [],
  },
});

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const sessionSchema = new mongoose.Schema({
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
  topics: [topicSchema],
  votingItems: [votingItemSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Session", sessionSchema);
