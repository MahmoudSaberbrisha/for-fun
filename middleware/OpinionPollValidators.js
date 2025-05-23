const { body, query, param, validationResult } = require("express-validator");

exports.insertOpinionPoll = [
  body("question")
    .isString()
    .withMessage("Question must be a string")
    .notEmpty()
    .withMessage("Question is required")
    .isLength({ min: 2 })
    .withMessage("Question must be at least 2 characters long"),

  body("option1")
    .isString()
    .withMessage("Option1 must be a string")
    .notEmpty()
    .withMessage("Option1 is required")
    .isLength({ min: 2 })
    .withMessage("Option1 must be at least 2 characters long"),

  body("option2")
    .isString()
    .withMessage("Option2 must be a string")
    .notEmpty()
    .withMessage("Option2 is required")
    .isLength({ min: 2 })
    .withMessage("Option2 must be at least 2 characters long"),

  body("status")
    .optional()
    .isString()
    .withMessage("Status must be a string")
    .isIn(["accepted", "rejected", "pending"])
    .withMessage("Status must be either 'accepted' or 'rejected' or 'pending'"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
