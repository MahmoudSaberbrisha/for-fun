const express = require("express");
const router = express.Router();

// Render discussion page
router.get("/discussion", (req, res) => {
  res.render("discussion");
});

module.exports = router;
