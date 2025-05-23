const express = require("express");
const router = express.Router();
const boardMeetingController = require("../../Controllers/BoardMeetingController");

// API endpoint to create a new board meeting
router.post("/boardmeetings", boardMeetingController.createBoardMeeting);

// API endpoint to get all open board meetings
router.get("/boardmeetings/open", boardMeetingController.getOpenBoardMeetings);

// Route to render board meetings page
router.get("/boardmeetings", boardMeetingController.renderBoardMeetingsPage);

// Route to render active board meetings page
router.get(
  "/boardmeetings/active",
  boardMeetingController.renderActiveBoardMeetingsPage
);

// Route to render minutes and decisions page
router.get(
  "/boardmeetings/minutes-decisions",
  boardMeetingController.renderMinutesDecisionsPage
);

// Route to render follow-up page
router.get(
  "/boardmeetings/follow-up",
  boardMeetingController.renderFollowUpPage
);

// API endpoint to update follow-up status and notes
router.put(
  "/boardmeetings/:id/follow-up",
  boardMeetingController.updateFollowUp
);

// API endpoint to update a board meeting by ID
router.put("/boardmeetings/:id", boardMeetingController.updateBoardMeeting);

// API endpoint to delete a board meeting by ID
router.delete("/boardmeetings/:id", boardMeetingController.deleteBoardMeeting);

// API endpoint to search board meetings
router.get("/boardmeetings/search", boardMeetingController.searchBoardMeetings);

// API endpoint to add a topic to a board meeting
router.post("/boardmeetings/:id/topics", boardMeetingController.addTopic);

// API endpoint to add a voting item to a board meeting
router.post(
  "/boardmeetings/:id/voting-items",
  boardMeetingController.addVotingItem
);

// API endpoint to cast a vote on a voting item
router.post("/boardmeetings/:id/vote", boardMeetingController.vote);

module.exports = router;
