const MemberJob = require("../models/MemberJob");

// Get all member jobs
exports.getAllMemberJobs = async (req, res, next) => {
  try {
    const jobs = await MemberJob.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};

// Create a new member job
exports.createMemberJob = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }
    const newJob = new MemberJob({ name });
    await newJob.save();
    res.status(201).json({ success: true, data: newJob });
  } catch (err) {
    next(err);
  }
};

// Update a member job by ID
exports.updateMemberJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const job = await MemberJob.findById(id);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Member job not found" });
    }
    job.name = name || job.name;
    await job.save();
    res.status(200).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

// Delete a member job by ID
exports.deleteMemberJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedJob = await MemberJob.findByIdAndDelete(id);
    if (!deletedJob) {
      return res
        .status(404)
        .json({ success: false, message: "Member job not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Member job deleted successfully" });
  } catch (err) {
    next(err);
  }
};
