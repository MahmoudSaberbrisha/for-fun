const express = require("express");
const router = express.Router();
const sessionController = require("../../Controllers/SessionController");

// API endpoint to create a new session
router.post("/sessions", sessionController.createSession);

// API endpoint to get all open sessions
router.get("/sessions/open", sessionController.getOpenSessions);

// Route to render sessions page
router.get("/sessions", sessionController.renderSessionsPage);

// Route to render sessions only page
router.get("/sessions/only", sessionController.renderSessionsOnlyPage);

// Route to render active sessions page
router.get("/sessions/active", sessionController.renderActiveSessionsPage);

// API endpoint to add topic to a session
router.post("/sessions/:id/topics", sessionController.addTopicToSession);

// API endpoint to add voting item to a session
router.post(
  "/sessions/:id/voting-items",
  sessionController.addVotingItemToSession
);

// API endpoint to submit a vote for a voting item
router.post(
  "/sessions/:id/voting-items/:itemIndex/vote",
  sessionController.submitVote
);

// API endpoint to update a session by ID
router.put("/sessions/:id", sessionController.updateSession);

// API endpoint to delete a session by ID
router.delete("/sessions/:id", sessionController.deleteSession);

// API endpoint to search sessions
router.get("/sessions/search", sessionController.searchSessions);

module.exports = router;
