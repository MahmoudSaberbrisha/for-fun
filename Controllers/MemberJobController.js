const MemberJob = require("../models/MemberJob");
const { validationResult } = require("express-validator");

// Render the member jobs page with list and edit item if any
exports.getAllMemberJobs = async (req, res) => {
  try {
    const items = await MemberJob.findAll({ order: [["createdAt", "ASC"]] });
    res.json(items);
  } catch (error) {
    console.error("Error fetching member jobs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Handle create new member job
exports.createMemberJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;
    const newJob = await MemberJob.create({ name });
    res.status(201).json(newJob);
  } catch (error) {
    console.error("Error creating member job:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Handle update member job
exports.updateMemberJob = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    const [updatedCount, [updatedJob]] = await MemberJob.update(
      { name },
      {
        where: { id },
        returning: true,
      }
    );
    if (updatedCount === 0) {
      return res.status(404).json({ message: "Member job not found" });
    }
    res.json(updatedJob);
  } catch (error) {
    console.error("Error updating member job:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Handle delete member job
exports.deleteMemberJob = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedCount = await MemberJob.destroy({ where: { id } });
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Member job not found" });
    }
    res.json({ message: "Member job deleted successfully" });
  } catch (error) {
    console.error("Error deleting member job:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
