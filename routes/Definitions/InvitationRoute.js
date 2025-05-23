const express = require("express");
const router = express.Router();
const InvitationController = require("../../Controllers/InvitationController");

// Render invitations page
router.get("/invitations", InvitationController.renderInvitationsPage);

// API routes
router.get("/api/invitations", InvitationController.getAllInvitations);
router.post("/api/invitations", InvitationController.createInvitation);
router.put("/api/invitations/:id", InvitationController.updateInvitation);
router.delete("/api/invitations/:id", InvitationController.deleteInvitation);
router.get("/api/invitations/search", InvitationController.searchInvitations);

module.exports = router;
