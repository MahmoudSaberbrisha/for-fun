const { Op } = require("sequelize");
const BoardMeeting = require("../models/BoardMeeting");
const Topic = require("../models/Topic");
const VotingItem = require("../models/VotingItem");
const { MeetingPlace } = require("../models/definitions");
const Member = require("../models/Member");

// Create a new board meeting
exports.createBoardMeeting = async (req, res, next) => {
  try {
    const {
      sessionNumber,
      date,
      day,
      time,
      duration,
      location,
      secretary,
      topic,
      title,
      description,
      status,
    } = req.body;

    const newBoardMeeting = await BoardMeeting.create({
      sessionNumber,
      date,
      day,
      time,
      duration,
      location,
      secretary,
      topic,
      title,
      description,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Board meeting created successfully",
      data: newBoardMeeting,
    });
  } catch (err) {
    next(err);
  }
};

// Get all open board meetings
exports.getOpenBoardMeetings = async (req, res, next) => {
  try {
    const boardMeetings = await BoardMeeting.findAll({
      where: { status: "Open" },
      order: [["date", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: boardMeetings,
    });
  } catch (err) {
    next(err);
  }
};

// Render board meetings page with open board meetings
exports.renderBoardMeetingsPage = async (req, res, next) => {
  try {
    const boardMeetings = await BoardMeeting.findAll({
      where: { status: "Open" },
      order: [["date", "DESC"]],
    });
    const meetingPlaces = await MeetingPlace.findAll({
      order: [["name", "ASC"]],
    });
    const members = await Member.findAll({
      where: { status: "Active" },
      order: [["name", "ASC"]],
    });

    // Find the highest sessionNumber starting with 'M' and get the numeric part
    const lastMeeting = await BoardMeeting.findOne({
      where: { sessionNumber: { [Op.like]: "M%" } },
      order: [["sessionNumber", "DESC"]],
    });

    let nextSessionNumber = "M1";
    if (lastMeeting && lastMeeting.sessionNumber) {
      const numPart = parseInt(lastMeeting.sessionNumber.substring(1));
      if (!isNaN(numPart)) {
        nextSessionNumber = "M" + (numPart + 1);
      }
    }

    res.render("boardMeetings", {
      boardMeetings,
      meetingPlaces,
      members,
      nextSessionNumber,
    });
  } catch (err) {
    next(err);
  }
};

// Render active board meetings page
exports.renderActiveBoardMeetingsPage = async (req, res, next) => {
  try {
    const boardMeetings = await BoardMeeting.findAll({
      where: { status: "Open" },
      order: [["date", "DESC"]],
    });
    res.render("boardMeetingsActive", {
      boardMeetings,
    });
  } catch (err) {
    next(err);
  }
};

// Update a board meeting by ID
exports.updateBoardMeeting = async (req, res, next) => {
  try {
    const boardMeetingId = req.params.id;
    const updateData = req.body;

    const [updatedCount, [updatedBoardMeeting]] = await BoardMeeting.update(
      updateData,
      {
        where: { id: boardMeetingId },
        returning: true,
      }
    );

    if (updatedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Board meeting not found" });
    }

    res.status(200).json({
      success: true,
      message: "Board meeting updated successfully",
      data: updatedBoardMeeting,
    });
  } catch (err) {
    next(err);
  }
};

// Delete a board meeting by ID
exports.deleteBoardMeeting = async (req, res, next) => {
  try {
    const boardMeetingId = req.params.id;

    const deletedCount = await BoardMeeting.destroy({
      where: { id: boardMeetingId },
    });

    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Board meeting not found" });
    }

    res.status(200).json({
      success: true,
      message: "Board meeting deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Add a topic to a board meeting
exports.addTopic = async (req, res, next) => {
  try {
    const boardMeetingId = req.params.id;
    const { title, description } = req.body;

    const boardMeeting = await BoardMeeting.findByPk(boardMeetingId);
    if (!boardMeeting) {
      return res
        .status(404)
        .json({ success: false, message: "Board meeting not found" });
    }

    const newTopic = await Topic.create({
      title,
      description,
      boardMeetingId,
    });

    res.status(201).json({
      success: true,
      message: "Topic added successfully",
      data: newTopic,
    });
  } catch (err) {
    next(err);
  }
};

// Add a voting item to a board meeting
exports.addVotingItem = async (req, res, next) => {
  try {
    const boardMeetingId = req.params.id;
    const { title, description } = req.body;

    const boardMeeting = await BoardMeeting.findByPk(boardMeetingId);
    if (!boardMeeting) {
      return res
        .status(404)
        .json({ success: false, message: "Board meeting not found" });
    }

    const newVotingItem = await VotingItem.create({
      title,
      description,
      votes: [],
      boardMeetingId,
    });

    res.status(201).json({
      success: true,
      message: "Voting item added successfully",
      data: newVotingItem,
    });
  } catch (err) {
    next(err);
  }
};

// Cast a vote on a voting item
exports.vote = async (req, res, next) => {
  try {
    const boardMeetingId = req.params.id;
    const { itemId, vote } = req.body;

    const votingItem = await VotingItem.findOne({
      where: { id: itemId, boardMeetingId },
    });

    if (!votingItem) {
      return res
        .status(404)
        .json({ success: false, message: "Voting item not found" });
    }

    if (vote !== "yes" && vote !== "no") {
      return res.status(400).json({ success: false, message: "Invalid vote" });
    }

    const votes = votingItem.votes || [];
    votes.push(vote);
    votingItem.votes = votes;
    await votingItem.save();

    res.status(200).json({
      success: true,
      message: "Vote recorded successfully",
      data: votingItem,
    });
  } catch (err) {
    next(err);
  }
};

// Search board meetings by query parameters
exports.searchBoardMeetings = async (req, res, next) => {
  try {
    const { sessionNumber, date, location, secretary, topic, status } =
      req.query;

    const where = {};

    const boardMeetings = await BoardMeeting.findAll({
      where,
      order: [["date", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: boardMeetings,
    });
  } catch (err) {
    next(err);
  }
};

// Render minutes and decisions page
exports.renderMinutesDecisionsPage = async (req, res, next) => {
  try {
    const boardMeetings = await BoardMeeting.findAll({
      where: { status: "Open" },
      order: [["date", "DESC"]],
    });
    res.render("boardMeetingsMinutes", {
      boardMeetings,
    });
  } catch (err) {
    next(err);
  }
};

// Render follow-up page
exports.renderFollowUpPage = async (req, res, next) => {
  try {
    const boardMeetings = await BoardMeeting.findAll({
      where: { status: "Open" },
      order: [["date", "DESC"]],
    });
    res.render("boardMeetingsFollowUp", {
      boardMeetings,
    });
  } catch (err) {
    next(err);
  }
};

// Update follow-up status and notes for a voting item
exports.updateFollowUp = async (req, res, next) => {
  try {
    const boardMeetingId = req.params.id;
    const { itemId, followUpStatus, followUpNotes } = req.body;

    const votingItem = await VotingItem.findOne({
      where: { id: itemId, boardMeetingId },
    });

    if (!votingItem) {
      return res
        .status(404)
        .json({ success: false, message: "Voting item not found" });
    }

    votingItem.followUpStatus = followUpStatus;
    votingItem.followUpNotes = followUpNotes;

    await votingItem.save();

    res.status(200).json({
      success: true,
      message: "Follow-up updated successfully",
      data: votingItem,
    });
  } catch (err) {
    next(err);
  }
};
