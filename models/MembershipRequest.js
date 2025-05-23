const mongoose = require("mongoose");

const membershipRequestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  nationalIdNumber: { type: String, required: true, unique: true, trim: true },
  gender: { type: String, enum: ["ذكر", "انثى"], required: true },
  birthDate: { type: Date, required: true },
  city: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  education: {
    type: String,
    enum: ["بكالوريوس", "ماجستير", "دكتوراه", "دبلوم عالي", "غير ذلك"],
    required: true,
  },
  profession: { type: String, required: true, trim: true },
  cvFilePath: { type: String }, // store file path or URL
  isEmployee: { type: Boolean, default: false },
  isSupplier: { type: Boolean, default: false },
  pledge: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MembershipRequest", membershipRequestSchema);
