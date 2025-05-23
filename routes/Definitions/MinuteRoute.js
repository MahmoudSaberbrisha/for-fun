const express = require("express");
const router = express.Router();
const minuteController = require("../../Controllers/MinuteController");

// API endpoint to create a new minute
router.post("/minutes", minuteController.createMinute);

// API endpoint to get all minutes
router.get("/minutes", minuteController.getMinutes);

// API endpoint to update a minute by ID
router.put("/minutes/:id", minuteController.updateMinute);

// API endpoint to delete a minute by ID
router.delete("/minutes/:id", minuteController.deleteMinute);

module.exports = router;
