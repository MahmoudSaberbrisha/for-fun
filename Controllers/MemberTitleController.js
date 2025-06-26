const { MemberTitle } = require("../models/definitions");
const { validationResult } = require("express-validator");

// Render the member titles page with list and edit item if any
exports.renderMemberTitlesPage = async (req, res) => {
  try {
    const items = await MemberTitle.findAll({ order: [["createdAt", "ASC"]] });
    const editItemId = req.query.edit;
    let editItem = null;
    if (editItemId) {
      editItem = await MemberTitle.findByPk(editItemId);
    }
    res.render("memberTitles", {
      items,
      editItem,
    });
  } catch (error) {
    console.error("Error rendering member titles page:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle create new member title
exports.createMemberTitle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;
    await MemberTitle.create({ name });
    res.redirect("/memberTitles");
  } catch (error) {
    console.error("Error creating member title:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle edit member title
exports.editMemberTitle = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    await MemberTitle.update({ name }, { where: { id } });
    res.redirect("/memberTitles");
  } catch (error) {
    console.error("Error editing member title:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle delete member title
exports.deleteMemberTitle = async (req, res) => {
  try {
    const id = req.params.id;
    await MemberTitle.destroy({ where: { id } });
    res.redirect("/memberTitles");
  } catch (error) {
    console.error("Error deleting member title:", error);
    res.status(500).send("Internal Server Error");
  }
};
