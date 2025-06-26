const Invitation = require("../models/Invitation");
const { Op } = require("sequelize");

// Create a new invitation
exports.createInvitation = async (req, res, next) => {
  try {
    const {
      invitationNumber,
      invitationDate,
      meetingType,
      memberName,
      memberTitleEnd,
      sessionNumber,
      meetingPlace,
      subject,
    } = req.body;

    const newInvitation = await Invitation.create({
      invitationNumber,
      invitationDate,
      meetingType,
      memberName,
      memberTitleEnd,
      sessionNumber,
      meetingPlace,
      subject,
    });

    res.status(201).json({
      success: true,
      message: "Invitation created successfully",
      data: newInvitation,
    });
  } catch (err) {
    next(err);
  }
};

// Get all invitations
exports.getAllInvitations = async (req, res, next) => {
  try {
    const invitations = await Invitation.findAll({
      order: [["invitationDate", "DESC"]],
    });
    res.status(200).json({
      success: true,
      data: invitations,
    });
  } catch (err) {
    next(err);
  }
};

// Render invitations page
exports.renderInvitationsPage = async (req, res, next) => {
  try {
    const invitations = await Invitation.findAll({
      order: [["invitationDate", "DESC"]],
    });
    res.render("invitations", { invitations });
  } catch (err) {
    next(err);
  }
};

// Update an invitation by ID
exports.updateInvitation = async (req, res, next) => {
  try {
    const invitationId = req.params.id;
    const updateData = req.body;

    const [updatedCount, [updatedInvitation]] = await Invitation.update(
      updateData,
      {
        where: { id: invitationId },
        returning: true,
      }
    );

    if (updatedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Invitation not found" });
    }

    res.status(200).json({
      success: true,
      message: "Invitation updated successfully",
      data: updatedInvitation,
    });
  } catch (err) {
    next(err);
  }
};

// Delete an invitation by ID
exports.deleteInvitation = async (req, res, next) => {
  try {
    const invitationId = req.params.id;

    const deletedCount = await Invitation.destroy({
      where: { id: invitationId },
    });

    if (deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Invitation not found" });
    }

    res.status(200).json({
      success: true,
      message: "Invitation deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// Search invitations by query parameters
exports.searchInvitations = async (req, res, next) => {
  try {
    const {
      invitationNumber,
      meetingType,
      memberName,
      sessionNumber,
      meetingPlace,
      subject,
    } = req.query;

    const where = {};

    if (invitationNumber) {
      where.invitationNumber = { [Op.like]: `%${invitationNumber}%` };
    }
    if (meetingType) {
      where.meetingType = { [Op.like]: `%${meetingType}%` };
    }
    if (memberName) {
      where.memberName = { [Op.like]: `%${memberName}%` };
    }
    if (sessionNumber) {
      where.sessionNumber = { [Op.like]: `%${sessionNumber}%` };
    }
    if (meetingPlace) {
      where.meetingPlace = { [Op.like]: `%${meetingPlace}%` };
    }
    if (subject) {
      where.subject = { [Op.like]: `%${subject}%` };
    }

    const invitations = await Invitation.findAll({
      where,
      order: [["invitationDate", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: invitations,
    });
  } catch (err) {
    next(err);
  }
};
