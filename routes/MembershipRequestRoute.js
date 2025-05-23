const express = require("express");
const router = express.Router();
const membershipRequestController = require("../Controllers/MembershipRequestController");
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// POST create membership request (no auth)
router.post(
  "/",
  upload.single("cv"),
  membershipRequestController.createRequest
);

// GET all membership requests (auth + role)
router.get(
  "/",
  verifyToken,
  checkRole(["Chairman", "BoardMember"]),
  membershipRequestController.getAllRequests
);

// POST accept membership request (auth only)
router.post(
  "/:id/accept",
  verifyToken,
  membershipRequestController.acceptRequest
);

// POST reject membership request (auth only)
router.post(
  "/:id/reject",
  verifyToken,
  membershipRequestController.rejectRequest
);

module.exports = router;
