const { body, validationResult } = require("express-validator");

exports.memberValidations = [
  body("membershipNumber")
    .notEmpty()
    .withMessage("Membership number is required")
    .trim(),
  body("name").notEmpty().withMessage("Member name is required").trim(),
  body("nationalIdNumber")
    .notEmpty()
    .withMessage("National ID number is required")
    .isNumeric()
    .withMessage("National ID number must be a number")
    .isLength({ min: 10, max: 14 })
    .withMessage("National ID number must be between 10 and 14 digits")
    .custom((value) => {
      if (isNaN(value) || !Number.isInteger(Number(value))) {
        throw new Error("National ID must be a valid integer number");
      }
      return true;
    }),

  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage("Please enter a valid phone number")
    .trim(),
  body("memberType")
    .notEmpty()
    .withMessage("Member type is required")
    .isIn(["Chairman", "BoardMember", "Employee", "Other"])
    .withMessage(
      "Member type must be one of: Chairman, BoardMember, Employee, Other"
    ),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be either Active or Inactive"),
  body("subscriptionStartDate")
    .notEmpty()
    .withMessage("Subscription start date is required")
    .isDate()
    .withMessage("Please enter a valid date for subscription start"),
  body("subscriptionEndDate")
    .notEmpty()
    .withMessage("Subscription end date is required")
    .isDate()
    .withMessage("Please enter a valid date for subscription end")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.subscriptionStartDate)) {
        throw new Error("Subscription end date must be on or after start date");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.updateMemberValidations = [
  body("membershipNumber")
    .optional()
    .notEmpty()
    .withMessage("Membership number cannot be empty")
    .trim(),
  body("name").optional().trim(),
  body("nationalIdNumber")
    .optional()
    .isNumeric()
    .withMessage("National ID number must be a number")
    .isLength({ min: 10, max: 14 })
    .withMessage("National ID number must be between 10 and 14 digits")
    .custom((value) => {
      if (isNaN(value) || !Number.isInteger(Number(value))) {
        throw new Error("National ID must be a valid integer number");
      }
      return true;
    }),
  body("phoneNumber")
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage("Please enter a valid phone number")
    .isLength({ min: 10, max: 14 })
    .withMessage("phoneNumber must be between 10 and 14 digits")

    .trim(),
  body("memberType")
    .optional()
    .isIn(["Chairman", "BoardMember", "Employee", "Other"])
    .withMessage(
      "Member type must be one of: Chairman, BoardMember, Employee, Other"
    ),
  body("status")
    .optional()
    .isIn(["Active", "Inactive"])
    .withMessage("Status must be either Active or Inactive"),
  body("subscriptionStartDate")
    .optional()
    .isDate()
    .withMessage("Please enter a valid date for subscription start"),
  body("subscriptionEndDate")
    .optional()
    .isDate()
    .withMessage("Please enter a valid date for subscription end")
    .custom((value, { req }) => {
      if (
        req.body.subscriptionStartDate &&
        new Date(value) < new Date(req.body.subscriptionStartDate)
      ) {
        throw new Error("Subscription end date must be on or after start date");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
