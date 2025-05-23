const BoardMeeting = require("../models/BoardMeeting");
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

    const newBoardMeeting = new BoardMeeting({
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

    await newBoardMeeting.save();

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
    const boardMeetings = await BoardMeeting.find({ status: "Open" }).sort({
      date: -1,
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
    const boardMeetings = await BoardMeeting.find({ status: "Open" }).sort({
      date: -1,
    });
    const meetingPlaces = await MeetingPlace.find().sort({ name: 1 });
    const members = await Member.find({ status: "Active" }).sort({ name: 1 });

    // Find the highest sessionNumber starting with 'M' and get the numeric part
    const lastMeeting = await BoardMeeting.findOne({ sessionNumber: /^M\d+$/ })
      .sort({ sessionNumber: -1 })
      .exec();

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
    const boardMeetings = await BoardMeeting.find({ status: "Open" }).sort({
      date: -1,
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

    const updatedBoardMeeting = await BoardMeeting.findByIdAndUpdate(
      boardMeetingId,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedBoardMeeting) {
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

    const deletedBoardMeeting = await BoardMeeting.findByIdAndDelete(
      boardMeetingId
    );

    if (!deletedBoardMeeting) {
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

    const boardMeeting = await BoardMeeting.findById(boardMeetingId);
    if (!boardMeeting) {
      return res
        .status(404)
        .json({ success: false, message: "Board meeting not found" });
    }

    boardMeeting.topics.push({ title, description });
    await boardMeeting.save();

    res.status(201).json({
      success: true,
      message: "Topic added successfully",
      data: boardMeeting,
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

    const boardMeeting = await BoardMeeting.findById(boardMeetingId);
    if (!boardMeeting) {
      return res
        .status(404)
        .json({ success: false, message: "Board meeting not found" });
    }

    boardMeeting.votingItems.push({ title, description, votes: [] });
    await boardMeeting.save();

    res.status(201).json({
      success: true,
      message: "Voting item added successfully",
      data: boardMeeting,
    });
  } catch (err) {
    next(err);
  }
};

// Cast a vote on a voting item
exports.vote = async (req, res, next) => {
  try {
    const boardMeetingId = req.params.id;
    const { itemIndex, vote } = req.body;

    const boardMeeting = await BoardMeeting.findById(boardMeetingId);
    if (!boardMeeting) {
      return res
        .status(404)
        .json({ success: false, message: "Board meeting not found" });
    }

    if (
      !boardMeeting.votingItems[itemIndex] ||
      (vote !== "yes" && vote !== "no")
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid voting item or vote" });
    }

    boardMeeting.votingItems[itemIndex].votes.push(vote);
    await boardMeeting.save();

    res.status(200).json({
      success: true,
      message: "Vote recorded successfully",
      data: boardMeeting,
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

    const query = {};

    if (sessionNumber) {
      query.sessionNumber = { $regex: sessionNumber, $options: "i" };
    }
    if (date) {
      query.date = new Date(date);
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (secretary) {
      query.secretary = { $regex: secretary, $options: "i" };
    }
    if (topic) {
      query.topic = { $regex: topic, $options: "i" };
    }
    if (status) {
      query.status = status;
    }

    const boardMeetings = await BoardMeeting.find(query).sort({ date: -1 });

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
    const boardMeetings = await BoardMeeting.find({ status: "Open" }).sort({
      date: -1,
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
    const boardMeetings = await BoardMeeting.find({ status: "Open" }).sort({
      date: -1,
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
    const { itemIndex, followUpStatus, followUpNotes } = req.body;

    const boardMeeting = await BoardMeeting.findById(boardMeetingId);
    if (!boardMeeting) {
      return res
        .status(404)
        .json({ success: false, message: "Board meeting not found" });
    }

    if (!boardMeeting.votingItems[itemIndex]) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid voting item index" });
    }

    boardMeeting.votingItems[itemIndex].followUpStatus = followUpStatus;
    boardMeeting.votingItems[itemIndex].followUpNotes = followUpNotes;

    await boardMeeting.save();

    res.status(200).json({
      success: true,
      message: "Follow-up updated successfully",
      data: boardMeeting,
    });
  } catch (err) {
    next(err);
  }
};
