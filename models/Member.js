const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  membershipNumber: {
    type: String,
    required: [true, "Membership number is required"],
    unique: true, // Ensure no duplicate membership numbers
    trim: true,
  },
  name: {
    type: String,
    required: [true, "Member name is required"],
    trim: true,
  },
  nationalIdNumber: {
    type: Number,
    required: [true, "National ID number is required"],
    unique: true, // Ensure no duplicate national IDs
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
  },
  memberType: {
    type: String,
    required: [true, "Member type is required"],
    enum: {
      values: ["Chairman", "BoardMember", "Employee", "Other"], // Add more types as needed
      message:
        "Member type must be one of: Chairman, BoardMember, Employee, Other",
    },
  },
  status: {
    type: String,
    required: [true, "Status is required"],
    enum: {
      values: ["Active", "Inactive"],
      message: "Status must be either Active or Inactive",
    },
    default: "Active",
  },
  subscriptionStartDate: {
    type: Date,
    required: [true, "Subscription start date is required"],
  },
  subscriptionEndDate: {
    type: Date,
    required: [true, "Subscription end date is required"],
  },
  councilCode: {
    type: String,
    required: [true, "Council code is required"],
    trim: true,
  },
  position: {
    type: String,
    required: [true, "Position is required"],
    trim: true,
  },
  appointmentDateHijri: {
    type: String,
    required: [true, "Appointment date (Hijri) is required"],
    trim: true,
  },
  shortName: {
    type: String,
    required: [true, "Short name is required"],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Member", memberSchema); // Maps to 'members' collection
