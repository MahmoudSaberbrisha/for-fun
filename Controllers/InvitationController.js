const Invitation = require("../models/Invitation");

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

    const newInvitation = new Invitation({
      invitationNumber,
      invitationDate,
      meetingType,
      memberName,
      memberTitleEnd,
      sessionNumber,
      meetingPlace,
      subject,
    });

    await newInvitation.save();

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
    const invitations = await Invitation.find().sort({ invitationDate: -1 });
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
    const invitations = await Invitation.find().sort({ invitationDate: -1 });
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

    const updatedInvitation = await Invitation.findByIdAndUpdate(
      invitationId,
      updateData,
      { new: true }
    );

    if (!updatedInvitation) {
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

    const deletedInvitation = await Invitation.findByIdAndDelete(invitationId);

    if (!deletedInvitation) {
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

    const query = {};

    if (invitationNumber) {
      query.invitationNumber = { $regex: invitationNumber, $options: "i" };
    }
    if (meetingType) {
      query.meetingType = { $regex: meetingType, $options: "i" };
    }
    if (memberName) {
      query.memberName = { $regex: memberName, $options: "i" };
    }
    if (sessionNumber) {
      query.sessionNumber = { $regex: sessionNumber, $options: "i" };
    }
    if (meetingPlace) {
      query.meetingPlace = { $regex: meetingPlace, $options: "i" };
    }
    if (subject) {
      query.subject = { $regex: subject, $options: "i" };
    }

    const invitations = await Invitation.find(query).sort({
      invitationDate: -1,
    });

    res.status(200).json({
      success: true,
      data: invitations,
    });
  } catch (err) {
    next(err);
  }
};
