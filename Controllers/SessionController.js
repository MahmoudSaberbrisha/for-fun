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

    const newSession = await Session.create({
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
      topics: [],
      votingItems: [],
    });

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
    const sessions = await Session.findAll({
      where: { status: "Open" },
      order: [["date", "DESC"]],
    });

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
    const sessions = await Session.findAll({
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

    // Calculate next session number
    let nextSessionNumber = "S1";
    if (sessions.length > 0) {
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

    const [updatedCount, [updatedSession]] = await Session.update(updateData, {
      where: { id: sessionId },
      returning: true,
    });

    if (updatedCount === 0) {
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

    const deletedCount = await Session.destroy({
      where: { id: sessionId },
    });

    if (deletedCount === 0) {
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

// Render sessions only page with all sessions
exports.renderSessionsOnlyPage = async (req, res, next) => {
  try {
    const sessions = await Session.findAll({
      order: [["date", "DESC"]],
    });
    res.render("sessionsOnly", {
      sessions,
    });
  } catch (err) {
    next(err);
  }
};

// Render active sessions page with sessions that are not finished
exports.renderActiveSessionsPage = async (req, res, next) => {
  try {
    let sessions = await Session.findAll({
      where: { status: { [Op.ne]: "Closed" } },
      order: [["date", "DESC"]],
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
            ...item,
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

// Add a topic to a session
exports.addTopicToSession = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const { title, description } = req.body;

    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    const topics = session.topics || [];
    topics.push({ title, description });
    session.topics = topics;
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

// Add a voting item to a session
exports.addVotingItemToSession = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const { title, description } = req.body;

    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    const votingItems = session.votingItems || [];
    votingItems.push({ title, description, votes: [] });
    session.votingItems = votingItems;
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

// Submit a vote for a voting item in a session
exports.submitVote = async (req, res, next) => {
  try {
    const sessionId = req.params.id;
    const itemIndex = parseInt(req.params.itemIndex);
    const { vote } = req.body;

    if (!["yes", "no"].includes(vote)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid vote value" });
    }

    const session = await Session.findByPk(sessionId);
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

    votingItem.votes.push(vote);

    session.votingItems[itemIndex] = votingItem;
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

    const where = {};

    if (sessionNumber) {
      where.sessionNumber = { [Op.like]: `%${sessionNumber}%` };
    }
    if (date) {
      where.date = new Date(date);
    }
    if (location) {
      where.location = { [Op.like]: `%${location}%` };
    }
    if (secretary) {
      where.secretary = { [Op.like]: `%${secretary}%` };
    }
    if (topic) {
      where.topic = { [Op.like]: `%${topic}%` };
    }
    if (status) {
      where.status = status;
    }

    const sessions = await Session.findAll({
      where,
      order: [["date", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (err) {
    next(err);
  }
};
