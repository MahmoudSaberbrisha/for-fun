const Board = require("../models/Board");
const path = require("path");
const fs = require("fs");

exports.getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find().sort({ createdAt: -1 });

    // Generate new boardCode
    let newBoardCode = "B001";
    if (boards.length > 0) {
      const latestCode = boards[0].boardCode;
      const match = latestCode.match(/B(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10) + 1;
        newBoardCode = "B" + num.toString().padStart(3, "0");
      }
    }

    // Fetch all members
    const Member = require("../models/Member");
    const members = await Member.find().sort({ createdAt: -1 });

    res.render("board", { boards, newBoardCode, members });
  } catch (error) {
    res.status(500).send("Error fetching boards");
  }
};

exports.getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).send("Board not found");
    }
    res.render("boardEdit", { board });
  } catch (error) {
    res.status(500).send("Error fetching board");
  }
};

exports.createBoard = async (req, res) => {
  try {
    const {
      boardCode,
      startDateHijri,
      startDateGregorian,
      appointmentDecisionNumber,
      endDateHijri,
      endDateGregorian,
      boardStatus,
      reason,
      members, // new field from form
    } = req.body;

    let decisionImagePath = "";
    if (req.file) {
      decisionImagePath = "/uploads/" + req.file.filename;
    } else {
      return res.status(400).send("Decision image is required");
    }

    // members can be a single string or array depending on selection
    let membersArray = [];
    if (members) {
      if (Array.isArray(members)) {
        membersArray = members;
      } else {
        membersArray = [members];
      }
    }

    const newBoard = new Board({
      boardCode,
      startDateHijri,
      startDateGregorian,
      appointmentDecisionNumber,
      endDateHijri,
      endDateGregorian,
      decisionImage: decisionImagePath,
      boardStatus,
      reason,
      members: membersArray,
    });

    await newBoard.save();
    res.redirect("/boards");
  } catch (error) {
    res.status(500).send("Error creating board");
  }
};

exports.updateBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).send("Board not found");
    }

    const {
      boardCode,
      startDateHijri,
      startDateGregorian,
      appointmentDecisionNumber,
      endDateHijri,
      endDateGregorian,
      boardStatus,
      reason,
    } = req.body;

    board.boardCode = boardCode;
    board.startDateHijri = startDateHijri;
    board.startDateGregorian = startDateGregorian;
    board.appointmentDecisionNumber = appointmentDecisionNumber;
    board.endDateHijri = endDateHijri;
    board.endDateGregorian = endDateGregorian;
    board.boardStatus = boardStatus;
    board.reason = reason;

    if (req.file) {
      // Delete old image file
      if (board.decisionImage) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "public",
          board.decisionImage
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      board.decisionImage = "/uploads/" + req.file.filename;
    }

    await board.save();
    res.redirect("/boards");
  } catch (error) {
    res.status(500).send("Error updating board");
  }
};
