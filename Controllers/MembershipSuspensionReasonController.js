const { MembershipSuspensionReason } = require("../models/definitions");
const { validationResult } = require("express-validator");

// Render the membership suspension reasons page with list and edit item if any
exports.renderMembershipSuspensionReasonsPage = async (req, res) => {
  try {
    const items = await MembershipSuspensionReason.findAll({
      order: [["createdAt", "ASC"]],
    });
    const editItemId = req.query.edit;
    let editItem = null;
    if (editItemId) {
      editItem = await MembershipSuspensionReason.findByPk(editItemId);
    }
    res.render("membershipSuspensionReasons", {
      items,
      editItem,
    });
  } catch (error) {
    console.error("Error rendering membership suspension reasons page:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle create new membership suspension reason
exports.createMembershipSuspensionReason = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;
    await MembershipSuspensionReason.create({ name });
    res.redirect("/membershipSuspensionReasons");
  } catch (error) {
    console.error("Error creating membership suspension reason:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle edit membership suspension reason
exports.editMembershipSuspensionReason = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    await MembershipSuspensionReason.update({ name }, { where: { id } });
    res.redirect("/membershipSuspensionReasons");
  } catch (error) {
    console.error("Error editing membership suspension reason:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle delete membership suspension reason
exports.deleteMembershipSuspensionReason = async (req, res) => {
  try {
    const id = req.params.id;
    await MembershipSuspensionReason.destroy({ where: { id } });
    res.redirect("/membershipSuspensionReasons");
  } catch (error) {
    console.error("Error deleting membership suspension reason:", error);
    res.status(500).send("Internal Server Error");
  }
};
