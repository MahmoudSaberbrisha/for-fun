const Member = require("../models/Member");
const MemberJob = require("../models/MemberJob");
const MembershipRequest = require("../models/MembershipRequest");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

// Setup multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "..", "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

exports.upload = multer({ storage: storage });

// Helper function to generate unique membershipNumber
async function generateUniqueMembershipNumber() {
  let unique = false;
  let membershipNumber = null;

  while (!unique) {
    membershipNumber = Math.floor(
      10000000 + Math.random() * 90000000
    ).toString();

    const existing = await Member.findOne({ where: { membershipNumber } });
    if (!existing) {
      unique = true;
    }
  }

  return membershipNumber;
}

exports.createMember = async (req, res, next) => {
  try {
    const {
      name,
      gender,
      nationality,
      title,
      maritalStatus,
      nationalIdNumber,
      issuingAuthority,
      issueDateHijri,
      issueDateGregorian,
      birthDateHijri,
      birthDateGregorian,
      age,
      phoneNumber,
      secondaryPhoneNumber,
      city,
      neighborhood,
      streetName,
      nationalAddress,
      email,
      academicDegree,
      academicQualifications,
      workLifeExperience,
      profession,
      workEntity,
      workAddress,
      workPhone,
      memberType,
      status,
      subscriptionStartDate,
      subscriptionEndDate,
      councilCode,
      position,
      appointmentDateHijri,
      shortName,
    } = req.body;

    const personalPhoto =
      req.files && req.files.personalPhoto
        ? req.files.personalPhoto[0].filename
        : null;
    const idPhoto =
      req.files && req.files.idPhoto ? req.files.idPhoto[0].filename : null;

    const membershipNumber = await generateUniqueMembershipNumber();

    const newMember = await Member.create({
      membershipNumber,
      name,
      gender,
      nationality,
      title,
      maritalStatus,
      nationalIdNumber,
      issuingAuthority,
      issueDateHijri,
      issueDateGregorian,
      birthDateHijri,
      birthDateGregorian,
      age,
      phoneNumber,
      secondaryPhoneNumber,
      city,
      neighborhood,
      streetName,
      nationalAddress,
      email,
      academicDegree,
      academicQualifications,
      workLifeExperience,
      profession,
      workEntity,
      workAddress,
      workPhone,
      personalPhoto,
      idPhoto,
      memberType,
      status,
      subscriptionStartDate,
      subscriptionEndDate,
      councilCode,
      position,
      appointmentDateHijri,
      shortName,
    });

    res.redirect("/api/members?message=Member added successfully");
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message:
          "Duplicate value error: membershipNumber or nationalIdNumber already exists",
      });
    }
    next(err);
  }
};

exports.renderMembersPage = async (req, res, next) => {
  try {
    const items = await Member.findAll();
    const memberJobs = await MemberJob.findAll();
    const positions = memberJobs.map((job) => job.name);
    const generatedMembershipNumber = await generateUniqueMembershipNumber();
    const membershipRequests = await MembershipRequest.findAll();
    res.render("members", {
      items,
      editItem: null,
      membershipRequests,
      positions,
      generatedMembershipNumber,
    });
  } catch (err) {
    next(err);
  }
};

exports.renderInactiveMembersPage = async (req, res, next) => {
  try {
    const items = await Member.findAll({ where: { status: "Inactive" } });
    res.render("inactiveMembers", { items, editItem: null });
  } catch (err) {
    next(err);
  }
};

exports.renderEditMemberPage = async (req, res, next) => {
  try {
    const items = await Member.findAll();
    const editItem = await Member.findByPk(req.params.id);
    if (!editItem) {
      return res.status(404).send("Member not found");
    }
    const generatedMembershipNumber = await generateUniqueMembershipNumber();
    const membershipRequests = await MembershipRequest.findAll();
    res.render("members", {
      items,
      editItem,
      generatedMembershipNumber,
      membershipRequests,
    });
  } catch (err) {
    next(err);
  }
};

exports.renderActiveMembersPage = async (req, res, next) => {
  try {
    const items = await Member.findAll({ where: { status: "Active" } });
    res.render("activeMembers", { items, editItem: null });
  } catch (err) {
    next(err);
  }
};

exports.getAllActiveMembers = async (req, res, next) => {
  try {
    const activeMembers = await Member.findAll({ where: { status: "Active" } });
    res.json({ success: true, data: activeMembers });
  } catch (err) {
    next(err);
  }
};

exports.getAllInactiveMembers = async (req, res, next) => {
  try {
    const inactiveMembers = await Member.findAll({
      where: { status: "Inactive" },
    });
    res.json({ success: true, data: inactiveMembers });
  } catch (err) {
    next(err);
  }
};

exports.searchMember = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Query parameter is required" });
    }
    const results = await Member.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { membershipNumber: { [Op.like]: `%${query}%` } },
        ],
      },
    });
    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

exports.updateMemberById = async (req, res, next) => {
  try {
    const memberId = req.params.id;
    const updateData = req.body;

    if (req.files) {
      if (req.files.personalPhoto) {
        updateData.personalPhoto = req.files.personalPhoto[0].filename;
      }
      if (req.files.idPhoto) {
        updateData.idPhoto = req.files.idPhoto[0].filename;
      }
    }

    const [updatedCount, [updatedMember]] = await Member.update(updateData, {
      where: { id: memberId },
      returning: true,
    });

    if (updatedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    res.json({
      success: true,
      message: "Member updated successfully",
      data: updatedMember,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMemberById = async (req, res, next) => {
  try {
    const memberId = req.params.id;
    const deletedCount = await Member.destroy({ where: { id: memberId } });

    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    }

    res.json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.handleUpdateMemberForm = async (req, res, next) => {
  try {
    const memberId = req.params.id;
    const updateData = req.body;

    if (req.files) {
      if (req.files.personalPhoto) {
        updateData.personalPhoto = req.files.personalPhoto[0].filename;
      }
      if (req.files.idPhoto) {
        updateData.idPhoto = req.files.idPhoto[0].filename;
      }
    }

    const [updatedCount, [updatedMember]] = await Member.update(updateData, {
      where: { id: memberId },
      returning: true,
    });

    if (updatedCount === 0) {
      return res.status(404).send("Member not found");
    }

    res.redirect("/definitions/members");
  } catch (err) {
    next(err);
  }
};

exports.loginMember = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number is required" });
    }

    // Validate phone number format
    const phoneRegex = /^966\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid phone number format" });
    }

    const member = await Member.findOne({ where: { phoneNumber } });

    if (!member) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid phone number" });
    }

    const token = jwt.sign(
      { userId: member.id, memberType: member.memberType },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 86400000 });

    res.redirect("/api/members");
  } catch (err) {
    console.error("Error in loginMember:", err);
    next(err);
  }
};

// Render profile basic data page
exports.renderBasicDataPage = async (req, res, next) => {
  try {
    const userId = req.userId;
    const member = await Member.findByPk(userId);
    if (!member) {
      return res.status(404).send("Member not found");
    }
    res.render("profile/basicData", { member });
  } catch (err) {
    next(err);
  }
};

// Render profile membership data page
exports.renderMembershipDataPage = async (req, res, next) => {
  try {
    const userId = req.userId;
    const member = await Member.findByPk(userId);
    if (!member) {
      return res.status(404).send("Member not found");
    }
    res.render("profile/membershipData", { member });
  } catch (err) {
    next(err);
  }
};

// Render profile attachments page
exports.renderAttachmentsPage = async (req, res, next) => {
  try {
    const userId = req.userId;
    const member = await Member.findByPk(userId);
    if (!member) {
      return res.status(404).send("Member not found");
    }
    res.render("profile/attachments", { member });
  } catch (err) {
    next(err);
  }
};

// Render profile account data page
exports.renderAccountDataPage = async (req, res, next) => {
  try {
    const userId = req.userId;
    const member = await Member.findByPk(userId);
    if (!member) {
      return res.status(404).send("Member not found");
    }
    res.render("profile/accountData", { member });
  } catch (err) {
    next(err);
  }
};
