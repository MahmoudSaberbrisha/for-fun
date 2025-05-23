const Session = require("../models/Session");
const { MeetingPlace } = require("../models/definitions");
const Member = require("../models/Member");

// Create a new session
exports.createSession = async (req, res, next) => {
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

    const newSession = new Session({
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

    await newSession.save();

    res.status(201).json({
      success: true,
      message: "Session created successfully",
      data: newSession,
    });
  } catch (err) {
    next(err);
  }
};

// Get all open sessions
exports.getOpenSessions = async (req, res, next) => {
  try {
    const sessions = await Session.find({ status: "Open" }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (err) {
    next(err);
  }
};

// Render sessions page with open sessions
exports.renderSessionsPage = async (req, res, next) => {
  try {
    const sessions = await Session.find({ status: "Open" }).sort({ date: -1 });
    const meetingPlaces = await MeetingPlace.find().sort({ name: 1 });
    const members = await Member.find({ status: "Active" }).sort({ name: 1 });

    // Calculate next session number
    let nextSessionNumber = "S1";
    if (sessions.length > 0) {
      // Extract numeric part from sessionNumber like "S1", "S2"
      const sessionNumbers = sessions
        .map((s) => s.sessionNumber)
        .filter((sn) => typeof sn === "string" && sn.match(/^S\d+$/))
        .map((sn) => parseInt(sn.substring(1)));
      if (sessionNumbers.length > 0) {
        const maxNumber = Math.max(...sessionNumbers);
        nextSessionNumber = "S" + (maxNumber + 1);
      }
    }

    res.render("sessions", {
      sessions,
      meetingPlaces,
      members,
      nextSessionNumber,
    });
  } catch (err) {
    next(err);
  }
};

// Update a session by ID
exports.updateSession = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const updateData = req.body;

    const updatedSession = await Session.findByIdAndUpdate(
      sessionId,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedSession) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    res.status(200).json({
      success: true,
      message: "Session updated successfully",
      data: updatedSession,
    });
  } catch (err) {
    next(err);
  }
};

// Delete a session by ID
exports.deleteSession = async (req, res, next) => {
  try {
    const sessionId = req.params.id;

    const deletedSession = await Session.findByIdAndDelete(sessionId);

    if (!deletedSession) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Render sessions only page with all sessions
 */
exports.renderSessionsOnlyPage = async (req, res, next) => {
  try {
    const sessions = await Session.find().sort({ date: -1 });
    res.render("sessionsOnly", {
      sessions,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Render active sessions page with sessions that are not finished
 */
exports.renderActiveSessionsPage = async (req, res, next) => {
  try {
    let sessions = await Session.find({ status: { $ne: "Closed" } }).sort({
      date: -1,
    });

    // Calculate vote counts for each voting item
    sessions = sessions.map((session) => {
      if (session.votingItems && session.votingItems.length > 0) {
        session.votingItems = session.votingItems.map((item) => {
          const yesVotes = item.votes
            ? item.votes.filter((v) => v === "yes").length
            : 0;
          const noVotes = item.votes
            ? item.votes.filter((v) => v === "no").length
            : 0;
          return {
            ...item.toObject(),
            yesVotes,
            noVotes,
          };
        });
      }
      return session;
    });

    res.render("activeSessions", {
      sessions,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Add a topic to a session
 */
exports.addTopicToSession = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const { title, description } = req.body;

    // Assuming Session model has a topics array field, if not, this needs to be added
    const session = await Session.findById(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    if (!session.topics) {
      session.topics = [];
    }

    session.topics.push({ title, description });
    await session.save();

    res.status(201).json({
      success: true,
      message: "Topic added successfully",
      data: session,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Add a voting item to a session
 */
exports.addVotingItemToSession = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const { title, description } = req.body;

    // Assuming Session model has a votingItems array field, if not, this needs to be added
    const session = await Session.findById(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    if (!session.votingItems) {
      session.votingItems = [];
    }

    session.votingItems.push({ title, description, votes: [] }); // votes array to track member votes
    await session.save();

    res.status(201).json({
      success: true,
      message: "Voting item added successfully",
      data: session,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Submit a vote for a voting item in a session
 */
exports.submitVote = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const itemIndex = parseInt(req.params.itemIndex);
    const { vote } = req.body; // expected 'yes' or 'no'

    if (!["yes", "no"].includes(vote)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid vote value" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    if (!session.votingItems || !session.votingItems[itemIndex]) {
      return res
        .status(404)
        .json({ success: false, message: "Voting item not found" });
    }

    const votingItem = session.votingItems[itemIndex];
    if (!votingItem.votes) {
      votingItem.votes = [];
    }

    // For simplicity, allow multiple votes; in real app, track voter identity to prevent duplicates
    votingItem.votes.push(vote);

    await session.save();

    res.status(200).json({
      success: true,
      message: "Vote submitted successfully",
      data: votingItem,
    });
  } catch (err) {
    next(err);
  }
};

// Search sessions by query parameters
exports.searchSessions = async (req, res, next) => {
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

    const sessions = await Session.find(query).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (err) {
    next(err);
  }
};
