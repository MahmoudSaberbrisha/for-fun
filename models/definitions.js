const mongoose = require("mongoose");
const { Schema } = mongoose;

// 1. Work Destinations Schema
const WorkDestinationSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

// 2. Membership Types Schema
const MembershipTypeSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

// 3. Member Jobs Schema
const MemberJobSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

// 4. Member Titles Schema
const MemberTitleSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

// 5. Meeting Places Schema
const MeetingPlaceSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

// 6. Cities Schema
const CitySchema = new Schema(
  {
    name: { type: String, required: true },
    order: { type: Number },
  },
  { timestamps: true }
);

// 7. Neighborhoods Schema
const NeighborhoodSchema = new Schema(
  {
    name: { type: String, required: true },
    order: { type: Number },
    city: { type: Schema.Types.ObjectId, ref: "City", required: true },
  },
  { timestamps: true }
);

// 8. Membership Suspension Reasons Schema
const MembershipSuspensionReasonSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

// Export models
module.exports = {
  WorkDestination: mongoose.model("WorkDestination", WorkDestinationSchema),
  MembershipType: mongoose.model("MembershipType", MembershipTypeSchema),
  MemberJob: mongoose.model("MemberJob", MemberJobSchema),
  MemberTitle: mongoose.model("MemberTitle", MemberTitleSchema),
  MeetingPlace: mongoose.model("MeetingPlace", MeetingPlaceSchema),
  City: mongoose.model("City", CitySchema),
  Neighborhood: mongoose.model("Neighborhood", NeighborhoodSchema),
  MembershipSuspensionReason: mongoose.model(
    "MembershipSuspensionReason",
    MembershipSuspensionReasonSchema
  ),
};
