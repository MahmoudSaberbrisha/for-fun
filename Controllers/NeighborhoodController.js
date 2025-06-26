const { Neighborhood, City } = require("../models/definitions");
const { validationResult } = require("express-validator");

// Render the neighborhoods page with list and edit item if any
exports.renderNeighborhoodsPage = async (req, res) => {
  try {
    const items = await Neighborhood.findAll({
      include: [{ model: City }],
      order: [["createdAt", "ASC"]],
    });
    const editItemId = req.query.edit;
    let editItem = null;
    if (editItemId) {
      editItem = await Neighborhood.findByPk(editItemId);
    }
    const cities = await City.findAll({ order: [["name", "ASC"]] });
    res.render("neighborhoods", {
      items,
      editItem,
      cities,
    });
  } catch (error) {
    console.error("Error rendering neighborhoods page:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle create new neighborhood
exports.createNeighborhood = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, order, cityId } = req.body;
    await Neighborhood.create({ name, order, cityId });
    res.redirect("/neighborhoods");
  } catch (error) {
    console.error("Error creating neighborhood:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle edit neighborhood
exports.editNeighborhood = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, order, cityId } = req.body;
    await Neighborhood.update({ name, order, cityId }, { where: { id } });
    res.redirect("/neighborhoods");
  } catch (error) {
    console.error("Error editing neighborhood:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle delete neighborhood
exports.deleteNeighborhood = async (req, res) => {
  try {
    const id = req.params.id;
    await Neighborhood.destroy({ where: { id } });
    res.redirect("/neighborhoods");
  } catch (error) {
    console.error("Error deleting neighborhood:", error);
    res.status(500).send("Internal Server Error");
  }
};
