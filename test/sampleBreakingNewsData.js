const mongoose = require("mongoose");
const BreakingNews = require("../models/BreakingNews");

async function addSampleBreakingNews() {
  try {
    await mongoose.connect(
      "mongodb+srv://mido10sb:Ma7moudSaber@cluster0.noqx1.mongodb.net/migo?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    const sampleNews = [
      { content: "Breaking News 1: Major event happening now!" },
      { content: "Breaking News 2: Important update on local news." },
      { content: "Breaking News 3: Weather alert issued for the area." },
    ];

    await BreakingNews.insertMany(sampleNews);
    console.log("Sample breaking news data added successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error adding sample breaking news data:", error);
    process.exit(1);
  }
}

addSampleBreakingNews();
