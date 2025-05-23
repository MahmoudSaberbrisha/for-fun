const express = require("express");
const router = express.Router();
const {
  createMember,
  getAllActiveMembers,
  getAllInactiveMembers,
  searchMember,
  updateMemberById,
  deleteMemberById,
  renderMembersPage,
  renderInactiveMembersPage,
  renderEditMemberPage,
  handleCreateMemberForm,
  handleUpdateMemberForm,
  renderActiveMembersPage,
  loginMember,
} = require("../../Controllers/MemberController");
const {
  memberValidations,
  updateMemberValidations,
} = require("../../middleware/MemberValidators");
const validator = require("../../middleware/validator");
const verifyToken = require("../../middleware/verifyToken");
const checkRole = require("../../middleware/checkRole");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// API routes returning JSON
router.post(
  "/",
  verifyToken,
  checkRole(["Chairman", "BoardMember"]),
  memberValidations,
  validator,
  createMember
);
router.get(
  "/active",
  verifyToken,
  checkRole(["Chairman", "BoardMember", "Employee"]),
  getAllActiveMembers
);
router.get(
  "/inactive",
  verifyToken,
  checkRole(["Chairman", "BoardMember", "Employee"]),
  getAllInactiveMembers
);
router.get(
  "/search",
  verifyToken,
  checkRole(["Chairman", "BoardMember", "Employee"]),
  searchMember
);
router.patch(
  "/:id",
  verifyToken,
  checkRole(["Chairman", "BoardMember"]),
  updateMemberValidations,
  validator,
  updateMemberById
);
router.delete("/:id", verifyToken, checkRole(["Chairman"]), deleteMemberById);

// Interactive pages routes rendering EJS views
router.get(
  "/",
  verifyToken,
  checkRole(["Chairman", "BoardMember", "Employee"]),
  renderMembersPage
);
router.get(
  "/inactive-page",
  verifyToken,
  checkRole(["Chairman", "BoardMember", "Employee"]),
  renderInactiveMembersPage
);
router.get(
  "/active-page",
  verifyToken,
  checkRole(["Chairman", "BoardMember", "Employee"]),
  renderActiveMembersPage
);
router.get(
  "/edit/:id",
  verifyToken,
  checkRole(["Chairman", "BoardMember"]),
  renderEditMemberPage
);
router.post(
  "/create",
  verifyToken,
  checkRole(["Chairman", "BoardMember"]),
  memberValidations,
  validator,
  handleCreateMemberForm
);
router.post(
  "/edit/:id",
  verifyToken,
  checkRole(["Chairman", "BoardMember"]),
  updateMemberValidations,
  validator,
  handleUpdateMemberForm
);

router.get("/membership-login", (req, res) => {
  res.render("membershipLogin");
});

// Member login route
router.post("/login", loginMember);

module.exports = router;
