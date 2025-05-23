const Member = require("../models/Member");
const mongoose = require("mongoose"); // أضف هذا السطر في بداية الملف

// Create a new member (API JSON response)
exports.createMember = async (req, res, next) => {
  try {
    const {
      membershipNumber,
      name,
      nationalIdNumber,
      phoneNumber,
      memberType,
      status,
      subscriptionStartDate,
      subscriptionEndDate,
      councilCode,
      position,
      appointmentDateHijri,
      shortName,
    } = req.body;

    const newMember = new Member({
      membershipNumber,
      name,
      nationalIdNumber,
      phoneNumber,
      memberType,
      status,
      subscriptionStartDate,
      subscriptionEndDate,
      councilCode,
      position,
      appointmentDateHijri,
      shortName,
    });

    await newMember.save();

    res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: newMember,
    });
  } catch (err) {
    next(err);
  }
};

// Render members page with list and empty edit form
const Board = require("../models/Board");

const MemberJob = require("../models/MemberJob");

const MembershipRequest = require("../models/MembershipRequest");

exports.renderMembersPage = async (req, res, next) => {
  try {
    const items = await Member.find();
    const boards = await Board.find({}, "boardCode").sort({ createdAt: -1 });
    const councilCodes = boards.map((board) => board.boardCode);

    const memberJobs = await MemberJob.find({}, "name").sort({ createdAt: -1 });
    const positions = memberJobs.map((job) => job.name);

    const membershipRequests = await MembershipRequest.find().sort({
      createdAt: -1,
    });

    res.render("members", {
      items,
      editItem: null,
      councilCodes,
      positions,
      membershipRequests,
    });
  } catch (err) {
    next(err);
  }
};

// Render inactive members page with list and empty edit form
exports.renderInactiveMembersPage = async (req, res, next) => {
  try {
    const items = await Member.find({ status: "Inactive" });
    res.render("inactiveMembers", { items, editItem: null });
  } catch (err) {
    next(err);
  }
};

// Render edit member page with list and edit form populated
exports.renderEditMemberPage = async (req, res, next) => {
  try {
    const items = await Member.find();
    const editItem = await Member.findById(req.params.id);
    if (!editItem) {
      return res.status(404).send("Member not found");
    }
    res.render("members", { items, editItem });
  } catch (err) {
    next(err);
  }
};

// Handle create member form submission and redirect to members page
exports.handleCreateMemberForm = async (req, res, next) => {
  try {
    const {
      membershipNumber,
      name,
      nationalIdNumber,
      phoneNumber,
      memberType,
      status,
      subscriptionStartDate,
      subscriptionEndDate,
      councilCode,
      position,
      appointmentDateHijri,
      shortName,
    } = req.body;

    const newMember = new Member({
      membershipNumber,
      name,
      nationalIdNumber,
      phoneNumber,
      memberType,
      status,
      subscriptionStartDate,
      subscriptionEndDate,
      councilCode,
      position,
      appointmentDateHijri,
      shortName,
    });

    await newMember.save();

    res.redirect("/api/members");
  } catch (err) {
    next(err);
  }
};

// Handle update member form submission and redirect to members page
exports.handleUpdateMemberForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid member ID");
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).send("No update data provided");
    }

    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).send("Member not found");
    }

    Object.keys(updates).forEach((key) => {
      if (key === "nationalIdNumber") {
        member[key] = Number(updates[key]);
      } else {
        member[key] = updates[key];
      }
    });

    await member.save();

    res.redirect("/api/members");
  } catch (err) {
    next(err);
  }
};

// Get all active members
exports.getAllActiveMembers = async (req, res, next) => {
  try {
    const members = await Member.find({ status: "Active" }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (err) {
    next(err);
  }
};

// Get all inactive members
exports.getAllInactiveMembers = async (req, res, next) => {
  try {
    const members = await Member.find({ status: "Inactive" }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (err) {
    next(err);
  }
};

// Search member by name or national ID
exports.searchMember = async (req, res, next) => {
  console.log(req.query);
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required for search",
      });
    }

    let searchCriteria = {};

    if (/[\u0600-\u06FF]/.test(query)) {
      searchCriteria = { name: { $regex: query, $options: "i" } }; // Case-insensitive search by name
    } else {
      searchCriteria = { membershipNumber: { $regex: query, $options: "i" } }; // Case-insensitive search by membership number
    }

    const members = await Member.find(searchCriteria);

    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (err) {
    next(err);
  }
};

// Update member by ID
exports.updateMemberById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body || {}; // Ensure updates is an object even if body is empty

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid member ID",
      });
    }

    // Check if updates object is empty
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update data provided",
      });
    }

    const member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    // Update only the fields that are present in the request
    Object.keys(updates).forEach((key) => {
      if (key === "nationalIdNumber") {
        member[key] = Number(updates[key]);
      } else {
        member[key] = updates[key];
      }
    });

    await member.save();

    res.status(200).json({
      success: true,
      message: "Member updated successfully",
      data: member,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Duplicate value error: membershipNumber or nationalIdNumber already exists",
      });
    }
    next(err);
  }
};

// Delete member by ID
exports.deleteMemberById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedMember = await Member.findByIdAndDelete(id);

    if (!deletedMember) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Render active members page with list and empty edit form
exports.renderActiveMembersPage = async (req, res, next) => {
  try {
    const items = await Member.find({ status: "Active" });
    res.render("activeMembers", { items, editItem: null });
  } catch (err) {
    next(err);
  }
};

const jwt = require("jsonwebtoken");

// Member login
exports.loginMember = async (req, res, next) => {
  try {
    const { membershipNumber, phoneNumber } = req.body;
    if (!membershipNumber || !phoneNumber) {
      return res.status(400).render("membershipLogin", {
        errorMessage: "الرجاء إدخال رقم العضوية ورقم الجوال",
      });
    }

    const member = await Member.findOne({ membershipNumber, phoneNumber });
    if (!member) {
      return res.status(401).render("membershipLogin", {
        errorMessage: "بيانات الدخول غير صحيحة",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: member._id, memberType: member.memberType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set token in cookie (optional)
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    // Redirect to /api/members after successful login
    res.redirect("/api/members");
  } catch (err) {
    next(err);
  }
};
