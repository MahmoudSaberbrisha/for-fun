const mongoose = require("mongoose");

const SubscriptionLogSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  subscriptionValue: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  operationType: {
    type: String,
    enum: ["استحقاق", "سداد"],
    required: true,
  },
  startYear: {
    type: Number,
    required: true,
  },
  endYear: {
    type: Number,
    required: true,
  },
  receiptDate: {
    type: Date,
  },
  receiptNumber: {
    type: String,
  },
  paymentMethod: {
    type: String,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("SubscriptionLog", SubscriptionLogSchema);
