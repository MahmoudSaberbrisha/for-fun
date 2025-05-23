const OpinionPoll = require("../models/OpinionPoll");

exports.createOpinionPoll = async (req, res, next) => {
  const { question, option1, option2, status, createdAt } = req.body;

  try {
    // Create a new opinion poll
    const newPoll = new OpinionPoll({
      question,
      option1,
      option2,
      status: status || "pending",
      createdAt: createdAt || Date.now(),
    });

    await newPoll.save();

    res.status(201).json({ message: "Opinion poll created successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getOpinionPolls = async (req, res, next) => {
  try {
    const opinionPolls = await OpinionPoll.find();
    res.status(200).json(opinionPolls);
  } catch (err) {
    next(err);
  }
};

exports.updatePollStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedPoll = await OpinionPoll.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedPoll) {
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

exports.renderOpinionPollsView = async (req, res, next) => {
  try {
    const opinionPolls = await OpinionPoll.find();
    res.render("opinionPolls", { opinionPolls });
  } catch (err) {
    next(err);
  }
};
