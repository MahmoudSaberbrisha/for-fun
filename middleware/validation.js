const { body, validationResult } = require("express-validator");

// Validation rules for different entities
const validateWorkDestination = [
  body("name").trim().notEmpty().withMessage("Name is required"),
];

const validateMembershipType = [
  body("name").trim().notEmpty().withMessage("Name is required"),
];

const validateMemberJob = [
  body("name").trim().notEmpty().withMessage("Name is required"),
];

const validateMemberTitle = [
  body("name").trim().notEmpty().withMessage("Name is required"),
];

const validateMeetingPlace = [
  body("name").trim().notEmpty().withMessage("Name is required"),
];

const validateCity = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("order").optional().isInt().withMessage("Order must be an integer"),
];

const validateNeighborhood = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("order").optional().isInt().withMessage("Order must be an integer"),
  body("city")
    .notEmpty()
    .withMessage("City is required")
    .isMongoId()
    .withMessage("City must be a valid ID"),
];

const validateMembershipSuspensionReason = [
  body("name").trim().notEmpty().withMessage("Name is required"),
];

// Middleware to check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return first error message for simplicity
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateWorkDestination,
  validateMembershipType,
  validateMemberJob,
  validateMemberTitle,
  validateMeetingPlace,
  validateCity,
  validateNeighborhood,
  validateMembershipSuspensionReason,
  checkValidation,
};
