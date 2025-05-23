const express = require("express");
const router = express.Router();
const memberJobController = require("../../Controllers/MemberJobController");

router.get("/", memberJobController.getAllMemberJobs);
router.post("/", memberJobController.createMemberJob);
router.put("/:id", memberJobController.updateMemberJob);
router.delete("/:id", memberJobController.deleteMemberJob);

module.exports = router;
