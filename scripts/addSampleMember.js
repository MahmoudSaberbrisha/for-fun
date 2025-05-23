const mongoose = require("mongoose");
const Member = require("../models/Member");

async function addSampleMember() {
  try {
    await mongoose.connect(
      "mongodb+srv://mido10sb:Ma7moudSaber@cluster0.noqx1.mongodb.net/migo?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    const sampleMember = new Member({
      membershipNumber: "M123456",
      name: "Test User",
      nationalIdNumber: "1234567890",
      phoneNumber: "+966500000000",
      memberType: "Regular",
      status: "Active",
      subscriptionStartDate: new Date("2023-01-01"),
      subscriptionEndDate: new Date("2024-01-01"),
      councilCode: "C001",
      position: "Member",
      appointmentDateHijri: "1444-01-01",
      shortName: "TestU",
    });

    await sampleMember.save();
    console.log("Sample member added successfully.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error adding sample member:", error);
  }
}

addSampleMember();
