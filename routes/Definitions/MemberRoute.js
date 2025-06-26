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
  upload, // import upload middleware
  renderBasicDataPage,
  renderMembershipDataPage,
  renderAttachmentsPage,
  renderAccountDataPage,
} = require("../../Controllers/MemberController");
const {
  memberValidations,
  updateMemberValidations,
} = require("../../middleware/MemberValidators");
const validator = require("../../middleware/validator");
const verifyToken = require("../../middleware/verifyToken");
const checkRole = require("../../middleware/checkRole");

// API routes returning JSON
router.post(
  "/",
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
  upload.fields([
    { name: "personalPhoto", maxCount: 1 },
    { name: "idPhoto", maxCount: 1 },
  ]),
  memberValidations,
  validator,
  createMember
);
router.post(
  "/edit/:id",
  verifyToken,
  checkRole(["Chairman", "BoardMember"]),
  upload.fields([
    { name: "personalPhoto", maxCount: 1 },
    { name: "idPhoto", maxCount: 1 },
  ]),
  updateMemberValidations,
  validator,
  handleUpdateMemberForm
);

router.get("/membership-login", (req, res) => {
  res.render("membershipLogin");
});

// Member login route
router.post("/login", loginMember);

// New profile section routes
router.get(
  "/profile/basic-data",
  verifyToken,
  checkRole(["Chairman", "BoardMember", "Employee"]),
  renderBasicDataPage
);
router.get(
  "/profile/membership-data",
  verifyToken,
  checkRole(["Chairman", "BoardMember", "Employee"]),
  renderMembershipDataPage
);
router.get(
  "/profile/attachments",
  verifyToken,
  checkRole(["Chairman", "BoardMember", "Employee"]),
  renderAttachmentsPage
);
router.get(
  "/profile/account-data",
  verifyToken,
  checkRole(["Chairman", "BoardMember", "Employee"]),
  renderAccountDataPage
);

module.exports = router;
