const { WorkDestination } = require("../models/definitions");
const { validationResult } = require("express-validator");

// Render the work destinations page with list and edit item if any
exports.renderWorkDestinationsPage = async (req, res) => {
  try {
    const items = await WorkDestination.findAll({
      order: [["createdAt", "ASC"]],
    });
    const editItemId = req.query.edit;
    let editItem = null;
    if (editItemId) {
      editItem = await WorkDestination.findByPk(editItemId);
    }
    res.render("workDestinations", {
      items,
      editItem,
    });
  } catch (error) {
    console.error("Error rendering work destinations page:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle create new work destination
exports.createWorkDestination = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;
    await WorkDestination.create({ name });
    res.redirect("/workDestinations");
  } catch (error) {
    console.error("Error creating work destination:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle edit work destination
exports.editWorkDestination = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    await WorkDestination.update({ name }, { where: { id } });
    res.redirect("/workDestinations");
  } catch (error) {
    console.error("Error editing work destination:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle delete work destination
exports.deleteWorkDestination = async (req, res) => {
  try {
    const id = req.params.id;
    await WorkDestination.destroy({ where: { id } });
    res.redirect("/workDestinations");
  } catch (error) {
    console.error("Error deleting work destination:", error);
    res.status(500).send("Internal Server Error");
  }
};
