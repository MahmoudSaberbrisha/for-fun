const { MembershipType } = require("../models/definitions");
const { validationResult } = require("express-validator");

// Render the membership types page with list and edit item if any
exports.renderMembershipTypesPage = async (req, res) => {
  try {
    const items = await MembershipType.findAll({
      order: [["createdAt", "ASC"]],
    });
    const editItemId = req.query.edit;
    let editItem = null;
    if (editItemId) {
      editItem = await MembershipType.findByPk(editItemId);
    }
    res.render("membershipTypes", {
      items,
      editItem,
    });
  } catch (error) {
    console.error("Error rendering membership types page:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle create new membership type
exports.createMembershipType = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;
    await MembershipType.create({ name });
    res.redirect("/membershipTypes");
  } catch (error) {
    console.error("Error creating membership type:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle edit membership type
exports.editMembershipType = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    await MembershipType.update({ name }, { where: { id } });
    res.redirect("/membershipTypes");
  } catch (error) {
    console.error("Error editing membership type:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle delete membership type
exports.deleteMembershipType = async (req, res) => {
  try {
    const id = req.params.id;
    await MembershipType.destroy({ where: { id } });
    res.redirect("/membershipTypes");
  } catch (error) {
    console.error("Error deleting membership type:", error);
    res.status(500).send("Internal Server Error");
  }
};
