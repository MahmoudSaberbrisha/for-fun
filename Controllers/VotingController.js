const Voting = require("../models/Voting");

// Create a new voting item
exports.createVoting = async (req, res, next) => {
  try {
    const { sessionId, title, options, status } = req.body;

    const newVoting = new Voting({
      sessionId,
      title,
      options,
      status,
    });

    await newVoting.save();

    res.status(201).json({
      success: true,
      message: "Voting created successfully",
      data: newVoting,
    });
  } catch (err) {
    next(err);
  }
};

// Get all open votings
exports.getOpenVotings = async (req, res, next) => {
  try {
    const votings = await Voting.find({ status: "Open" }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: votings,
    });
  } catch (err) {
    next(err);
  }
};

// Render votings page with open votings
exports.renderVotingsPage = async (req, res, next) => {
  try {
    const votings = await Voting.find({ status: "Open" }).sort({
      createdAt: -1,
    });
    res.render("votings", { votings });
  } catch (err) {
    next(err);
  }
};
