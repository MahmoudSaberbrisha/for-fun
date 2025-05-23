const mongoose = require("mongoose");

const MemberJobSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.MemberJob || mongoose.model("MemberJob", MemberJobSchema);
