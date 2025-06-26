const express = require("express");
const router = express.Router();
const {
  renderCitiesPage,
  createCity,
  editCity,
  deleteCity,
} = require("../../Controllers/CitiesController");
const { body } = require("express-validator");
const verifyToken = require("../../middleware/verifyToken");
const checkRole = require("../../middleware/checkRole");

// Render cities page
router.get(
  "/cities",
  verifyToken,
  checkRole(["Chairman", "BoardMember", "Employee"]),
  renderCitiesPage
);

// Create new city
router.post(
  "/cities",
  verifyToken,
  checkRole(["Chairman", "BoardMember"]),
  body("name").notEmpty().withMessage("Name is required"),
  createCity
);

// Edit city
router.post(
  "/cities/edit/:id",
  verifyToken,
  checkRole(["Chairman", "BoardMember"]),
  body("name").notEmpty().withMessage("Name is required"),
  editCity
);

// Delete city
router.post(
  "/cities/delete/:id",
  verifyToken,
  checkRole(["Chairman", "BoardMember"]),
  deleteCity
);

module.exports = router;
