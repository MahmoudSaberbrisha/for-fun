const express = require("express");
const router = express.Router();
const votingController = require("../../Controllers/VotingController");

// API endpoint to create a new voting
router.post("/votings", votingController.createVoting);

// API endpoint to get all open votings
router.get("/votings/open", votingController.getOpenVotings);

// Route to render votings page
router.get("/votings", votingController.renderVotingsPage);

module.exports = router;
