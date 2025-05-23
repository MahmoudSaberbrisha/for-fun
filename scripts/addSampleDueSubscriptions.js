const mongoose = require("mongoose");
const Member = require("../models/Member");
const SubscriptionLog = require("../models/SubscriptionLog");

async function addSampleDueSubscriptions() {
  try {
    await mongoose.connect(
      "mongodb+srv://mido10sb:Ma7moudSaber@cluster0.noqx1.mongodb.net/migo?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    // Find the sample member by membershipNumber
    const member = await Member.findOne({ membershipNumber: "M123456" });
    if (!member) {
      console.log(
        "Sample member not found. Please run addSampleMember.js first."
      );
      await mongoose.disconnect();
      return;
    }

    // Create sample due subscriptions
    const dueSubscriptions = [
      {
        memberId: member._id,
        subscriptionValue: 100,
        date: new Date(),
        operationType: "استحقاق",
        startYear: 2023,
        endYear: 2023,
        description: "اشتراك عام 2023",
      },
      {
        memberId: member._id,
        subscriptionValue: 120,
        date: new Date(),
        operationType: "استحقاق",
        startYear: 2024,
        endYear: 2024,
        description: "اشتراك عام 2024",
      },
    ];

    await SubscriptionLog.insertMany(dueSubscriptions);
    console.log("Sample due subscriptions added successfully.");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error adding sample due subscriptions:", error);
  }
}

addSampleDueSubscriptions();
