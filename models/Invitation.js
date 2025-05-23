const mongoose = require("mongoose");

const InvitationSchema = new mongoose.Schema(
  {
    invitationNumber: { type: String, required: true, unique: true },
    invitationDate: { type: Date, required: true },
    meetingType: { type: String, required: true },
    memberName: { type: String, required: true },
    memberTitleEnd: { type: String, required: true },
    sessionNumber: { type: String, required: true },
    meetingPlace: { type: String, required: true },
    subject: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invitation", InvitationSchema);
