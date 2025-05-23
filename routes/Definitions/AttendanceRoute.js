const express = require("express");
const router = express.Router();
const attendanceController = require("../../Controllers/AttendanceController");

// API endpoint to mark attendance
router.post("/attendance/mark", attendanceController.markAttendance);

router.get("/attendance", attendanceController.renderAllAttendancePage);

// API endpoint to get attendance by session
// Remove duplicate route to avoid conflict
router.get(
  "/attendance/session/:sessionId",
  attendanceController.renderAttendancePage
);

module.exports = router;
