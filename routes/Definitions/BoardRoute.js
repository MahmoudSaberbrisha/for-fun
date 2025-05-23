const express = require("express");
const router = express.Router();
const BoardController = require("../../Controllers/BoardController");
const multer = require("multer");
const path = require("path");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g. 1234567890.jpg
  },
});
const upload = multer({ storage: storage });

// Routes
router.get("/boards", BoardController.getAllBoards);
router.get("/boards/:id", BoardController.getBoardById);
router.post(
  "/boards",
  upload.single("decisionImage"),
  BoardController.createBoard
);
router.post(
  "/boards/:id",
  upload.single("decisionImage"),
  BoardController.updateBoard
);

module.exports = router;
