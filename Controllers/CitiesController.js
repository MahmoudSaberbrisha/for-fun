const City = require("../models/City");
const { validationResult } = require("express-validator");

// Render the cities page with list and edit item if any
exports.renderCitiesPage = async (req, res) => {
  try {
    const items = await City.findAll({ order: [["order", "ASC"]] });
    const editItemId = req.query.edit;
    let editItem = null;
    if (editItemId) {
      editItem = await City.findByPk(editItemId);
    }
    res.render("cities", {
      lang: req.getLocale ? req.getLocale() : "ar",
      t: req.t ? req.t : (key) => key,
      items,
      editItem,
    });
  } catch (error) {
    console.error("Error rendering cities page:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle create new city
exports.createCity = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, order } = req.body;
    const city = await City.create({ name, order });
    res.redirect("/cities");
  } catch (error) {
    console.error("Error creating city:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle edit city
exports.editCity = async (req, res) => {
  try {
    const cityId = req.params.id;
    const { name, order } = req.body;
    await City.update({ name, order }, { where: { id: cityId } });
    res.redirect("/cities");
  } catch (error) {
    console.error("Error editing city:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Handle delete city
exports.deleteCity = async (req, res) => {
  try {
    const cityId = req.params.id;
    await City.destroy({ where: { id: cityId } });
    res.redirect("/cities");
  } catch (error) {
    console.error("Error deleting city:", error);
    res.status(500).send("Internal Server Error");
  }
};
