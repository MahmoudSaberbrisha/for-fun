const Voting = require("../models/Voting");

// Create a new voting item
exports.createVoting = async (req, res, next) => {
  try {
    const { sessionId, title, options, status } = req.body;

    const newVoting = await Voting.create({
      sessionId,
      title,
      options,
      status,
    });

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
    const votings = await Voting.findAll({
      where: { status: "Open" },
      order: [["createdAt", "DESC"]],
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
    const votings = await Voting.findAll({
      where: { status: "Open" },
      order: [["createdAt", "DESC"]],
    });
    res.render("votings", { votings });
  } catch (err) {
    next(err);
  }
};
