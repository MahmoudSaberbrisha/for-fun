const OpinionPoll = require("../models/OpinionPoll");

// Create a new opinion poll
exports.createOpinionPoll = async (req, res, next) => {
  const { question, option1, option2, status, createdAt } = req.body;

  try {
    const newPoll = await OpinionPoll.create({
      question,
      option1,
      option2,
      status: status || "pending",
      createdAt: createdAt || new Date(),
    });

    res.status(201).json({ message: "Opinion poll created successfully" });
  } catch (err) {
    next(err);
  }
};

// Get all opinion polls
exports.getOpinionPolls = async (req, res, next) => {
  try {
    const opinionPolls = await OpinionPoll.findAll();
    res.status(200).json(opinionPolls);
  } catch (err) {
    next(err);
  }
};

// Update poll status by ID
exports.updatePollStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [updatedCount, [updatedPoll]] = await OpinionPoll.update(
      { status },
      { where: { id }, returning: true }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Opinion poll not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      data: updatedPoll,
    });
  } catch (err) {
    next(err);
  }
};

// Render opinion polls view
exports.renderOpinionPollsView = async (req, res, next) => {
  try {
    const opinionPolls = await OpinionPoll.findAll();
    res.render("opinionPolls", { opinionPolls });
  } catch (err) {
    next(err);
  }
};
