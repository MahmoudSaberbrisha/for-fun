const { MeetingPlace } = require("../models/definitions");
const { validationResult } = require("express-validator");

// Render the meeting places page with list and edit item if any
exports.renderMeetingPlacesPage = async (req, res) => {
  try {
    const items = await MeetingPlace.findAll({ order: [["createdAt", "ASC"]] });
    const editItemId = req.query.edit;
    let editItem = null;
    if (editItemId) {
      editItem = await MeetingPlace.findByPk(editItemId);
    }
    res.render("meetingPlaces", {
      items,
      editItem,
    });
  } catch (error) {
    console.error("Error rendering meeting places page:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle create new meeting place
exports.createMeetingPlace = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name } = req.body;
    await MeetingPlace.create({ name });
    res.redirect("/meetingPlaces");
  } catch (error) {
    console.error("Error creating meeting place:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle edit meeting place
exports.editMeetingPlace = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    await MeetingPlace.update({ name }, { where: { id } });
    res.redirect("/meetingPlaces");
  } catch (error) {
    console.error("Error editing meeting place:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle delete meeting place
exports.deleteMeetingPlace = async (req, res) => {
  try {
    const id = req.params.id;
    await MeetingPlace.destroy({ where: { id } });
    res.redirect("/meetingPlaces");
  } catch (error) {
    console.error("Error deleting meeting place:", error);
    res.status(500).send("Internal Server Error");
  }
};
