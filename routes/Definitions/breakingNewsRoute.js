const express = require("express");
const router = express.Router();
const {
  createBreakingNews,
  getAllBreakingNews,
  updateBreakingNews,
  searchBreakingNews, // Add this line
} = require("../../Controllers/breakingNewsController");
const {
  validateBreakingNews,
} = require("../../middleware/breakingNewsValidators");
const validator = require("../../middleware/validator");

// Create new breaking news
router.post("/", validateBreakingNews, validator, createBreakingNews);

// Get all breaking news
router.get("/", getAllBreakingNews);

// Update breaking news
router.put("/:id", validateBreakingNews, validator, updateBreakingNews);

// Search breaking news
router.get("/search", searchBreakingNews);

module.exports = router;
