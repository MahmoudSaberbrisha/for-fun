const mongoose = require("mongoose");
const assert = require("assert");
const {
  WorkDestination,
  MembershipType,
  MemberJob,
  MemberTitle,
  MeetingPlace,
  City,
  Neighborhood,
  MembershipSuspensionReason,
} = require("../models/definitions");

async function runTests() {
  try {
    await mongoose.connect("mongodb://localhost:27017/testdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear collections before tests
    await Promise.all([
      WorkDestination.deleteMany({}),
      MembershipType.deleteMany({}),
      MemberJob.deleteMany({}),
      MemberTitle.deleteMany({}),
      MeetingPlace.deleteMany({}),
      City.deleteMany({}),
      Neighborhood.deleteMany({}),
      MembershipSuspensionReason.deleteMany({}),
    ]);

    // Test WorkDestination schema
    let wd = new WorkDestination({ name: "Test Work Destination" });
    await wd.save();
    let foundWd = await WorkDestination.findOne({
      name: "Test Work Destination",
    });
    assert(foundWd, "WorkDestination not saved or found");

    // Test MembershipType schema
    let mt = new MembershipType({ name: "Test Membership Type" });
    await mt.save();
    let foundMt = await MembershipType.findOne({
      name: "Test Membership Type",
    });
    assert(foundMt, "MembershipType not saved or found");

    // Test MemberJob schema
    let mj = new MemberJob({ name: "Test Member Job" });
    await mj.save();
    let foundMj = await MemberJob.findOne({ name: "Test Member Job" });
    assert(foundMj, "MemberJob not saved or found");

    // Test MemberTitle schema
    let mtitle = new MemberTitle({ name: "Test Member Title" });
    await mtitle.save();
    let foundMtitle = await MemberTitle.findOne({ name: "Test Member Title" });
    assert(foundMtitle, "MemberTitle not saved or found");

    // Test MeetingPlace schema
    let mp = new MeetingPlace({ name: "Test Meeting Place" });
    await mp.save();
    let foundMp = await MeetingPlace.findOne({ name: "Test Meeting Place" });
    assert(foundMp, "MeetingPlace not saved or found");

    // Test City schema with order
    let city = new City({ name: "Test City", order: 1 });
    await city.save();
    let foundCity = await City.findOne({ name: "Test City" });
    assert(
      foundCity && foundCity.order === 1,
      "City not saved or order incorrect"
    );

    // Test Neighborhood schema with city reference and order
    let neighborhood = new Neighborhood({
      name: "Test Neighborhood",
      order: 1,
      city: city._id,
    });
    await neighborhood.save();
    let foundNeighborhood = await Neighborhood.findOne({
      name: "Test Neighborhood",
    }).populate("city");
    assert(
      foundNeighborhood && foundNeighborhood.city.name === "Test City",
      "Neighborhood or city reference not saved correctly"
    );

    // Test MembershipSuspensionReason schema
    let msr = new MembershipSuspensionReason({
      name: "Test Suspension Reason",
    });
    await msr.save();
    let foundMsr = await MembershipSuspensionReason.findOne({
      name: "Test Suspension Reason",
    });
    assert(foundMsr, "MembershipSuspensionReason not saved or found");

    console.log("All schema tests passed successfully.");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Test failed:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

runTests();
