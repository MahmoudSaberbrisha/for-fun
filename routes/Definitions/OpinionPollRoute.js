const express = require("express");
const router = express.Router();
const { insertOpinionPoll } = require("../../middleware/OpinionPollValidators");
const {
  createOpinionPoll,
  getOpinionPolls,
  updatePollStatus,
  renderOpinionPollsView,
} = require("../../Controllers/opinionPollController");
const validator = require("../../middleware/validator");

// Route to render opinion poll creation form
router.get("/create", (req, res) => {
  res.render("opinionPoll");
});

// Route to render interactive opinion polls list page
router.get("/view", renderOpinionPollsView);

router.post("/", insertOpinionPoll, validator, createOpinionPoll);
router.post("/create", insertOpinionPoll, validator, createOpinionPoll);
router.get("/", (req, res) => {
  res.redirect("/api/opinionPolls/view");
});
router.get("/view", renderOpinionPollsView);
router.patch("/status/:id", validator, updatePollStatus);

module.exports = router;
