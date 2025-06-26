const express = require("express");
const router = express.Router();
const {
  WorkDestination,
  MembershipType,
  MemberJob,
  MemberTitle,
  MeetingPlace,
  City,
  Neighborhood,
  MembershipSuspensionReason,
} = require("../../models/definitions");

const {
  validateWorkDestination,
  validateMembershipType,
  validateMemberJob,
  validateMemberTitle,
  validateMeetingPlace,
  validateCity,
  validateNeighborhood,
  validateMembershipSuspensionReason,
  checkValidation,
} = require("../../middleware/validation");

// Helper function to handle async route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// WorkDestination routes
router.get(
  "/workdestinations",
  asyncHandler(async (req, res) => {
    const items = await WorkDestination.findAll();
    res.render("workdestinations", { items, editItem: null });
  })
);

router.post(
  "/workdestinations",
  validateWorkDestination,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    await WorkDestination.create({ name, description });
    res.redirect("/api/workdestinations");
  })
);

router.get(
  "/workdestinations/edit/:id",
  asyncHandler(async (req, res) => {
    const items = await WorkDestination.findAll();
    const editItem = await WorkDestination.findByPk(req.params.id);
    res.render("workdestinations", { items, editItem });
  })
);

router.post(
  "/workdestinations/edit/:id",
  validateWorkDestination,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    await WorkDestination.update(
      { name, description },
      { where: { id: req.params.id } }
    );
    res.redirect("/api/workdestinations");
  })
);

router.post(
  "/workdestinations/delete/:id",
  asyncHandler(async (req, res) => {
    await WorkDestination.destroy({ where: { id: req.params.id } });
    res.redirect("/api/workdestinations");
  })
);

// MembershipType routes
router.get(
  "/membershiptypes",
  asyncHandler(async (req, res) => {
    const items = await MembershipType.findAll();
    res.render("membershiptypes", { items, editItem: null });
  })
);

router.post(
  "/membershiptypes",
  validateMembershipType,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    await MembershipType.create({ name });
    res.redirect("/api/membershiptypes");
  })
);

router.get(
  "/membershiptypes/edit/:id",
  asyncHandler(async (req, res) => {
    const items = await MembershipType.findAll();
    const editItem = await MembershipType.findByPk(req.params.id);
    res.render("membershiptypes", { items, editItem });
  })
);

router.post(
  "/membershiptypes/edit/:id",
  validateMembershipType,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    await MembershipType.update({ name }, { where: { id: req.params.id } });
    res.redirect("/api/membershiptypes");
  })
);

router.post(
  "/membershiptypes/delete/:id",
  asyncHandler(async (req, res) => {
    await MembershipType.destroy({ where: { id: req.params.id } });
    res.redirect("/api/membershiptypes");
  })
);

// MemberJob routes
router.get(
  "/memberjobs",
  asyncHandler(async (req, res) => {
    const items = await MemberJob.findAll();
    res.render("memberjobs", { items, editItem: null });
  })
);

router.post(
  "/memberjobs",
  validateMemberJob,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    await MemberJob.create({ name });
    res.redirect("/api/memberjobs");
  })
);

router.get(
  "/memberjobs/edit/:id",
  asyncHandler(async (req, res) => {
    const items = await MemberJob.findAll();
    const editItem = await MemberJob.findByPk(req.params.id);
    res.render("memberjobs", { items, editItem });
  })
);

router.post(
  "/memberjobs/edit/:id",
  validateMemberJob,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    await MemberJob.update({ name }, { where: { id: req.params.id } });
    res.redirect("/api/memberjobs");
  })
);

router.post(
  "/memberjobs/delete/:id",
  asyncHandler(async (req, res) => {
    await MemberJob.destroy({ where: { id: req.params.id } });
    res.redirect("/api/memberjobs");
  })
);

// MemberTitle routes
router.get(
  "/membertitles",
  asyncHandler(async (req, res) => {
    const items = await MemberTitle.findAll();
    res.render("membertitles", { items, editItem: null });
  })
);

router.post(
  "/membertitles",
  validateMemberTitle,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    await MemberTitle.create({ name });
    res.redirect("/api/membertitles");
  })
);

router.get(
  "/membertitles/edit/:id",
  asyncHandler(async (req, res) => {
    const items = await MemberTitle.findAll();
    const editItem = await MemberTitle.findByPk(req.params.id);
    res.render("membertitles", { items, editItem });
  })
);

router.post(
  "/membertitles/edit/:id",
  validateMemberTitle,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    await MemberTitle.update({ name }, { where: { id: req.params.id } });
    res.redirect("/api/membertitles");
  })
);

router.post(
  "/membertitles/delete/:id",
  asyncHandler(async (req, res) => {
    await MemberTitle.destroy({ where: { id: req.params.id } });
    res.redirect("/api/membertitles");
  })
);

// MeetingPlace routes
router.get(
  "/meetingplaces",
  asyncHandler(async (req, res) => {
    const items = await MeetingPlace.findAll();
    res.render("meetingplaces", { items, editItem: null });
  })
);

router.post(
  "/meetingplaces",
  validateMeetingPlace,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    await MeetingPlace.create({ name });
    res.redirect("/api/meetingplaces");
  })
);

router.get(
  "/meetingplaces/edit/:id",
  asyncHandler(async (req, res) => {
    const items = await MeetingPlace.findAll();
    const editItem = await MeetingPlace.findByPk(req.params.id);
    res.render("meetingplaces", { items, editItem });
  })
);

router.post(
  "/meetingplaces/edit/:id",
  validateMeetingPlace,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    await MeetingPlace.update({ name }, { where: { id: req.params.id } });
    res.redirect("/api/meetingplaces");
  })
);

router.post(
  "/meetingplaces/delete/:id",
  asyncHandler(async (req, res) => {
    await MeetingPlace.destroy({ where: { id: req.params.id } });
    res.redirect("/api/meetingplaces");
  })
);

// City routes
router.get(
  "/cities",
  asyncHandler(async (req, res) => {
    const items = await City.findAll();
    res.render("cities", { items, editItem: null });
  })
);

router.post(
  "/cities",
  validateCity,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name, order } = req.body;
    await City.create({ name, order });
    res.redirect("/api/cities");
  })
);

router.get(
  "/cities/edit/:id",
  asyncHandler(async (req, res) => {
    const items = await City.findAll();
    const editItem = await City.findByPk(req.params.id);
    res.render("cities", { items, editItem });
  })
);

router.post(
  "/cities/edit/:id",
  validateCity,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name, order } = req.body;
    await City.update({ name, order }, { where: { id: req.params.id } });
    res.redirect("/api/cities");
  })
);

router.post(
  "/cities/delete/:id",
  asyncHandler(async (req, res) => {
    await City.destroy({ where: { id: req.params.id } });
    res.redirect("/api/cities");
  })
);

// Neighborhood routes
router.get(
  "/neighborhoods",
  asyncHandler(async (req, res) => {
    const items = await Neighborhood.findAll({ include: City });
    const cities = await City.findAll();
    res.render("neighborhoods", { items, cities, editItem: null });
  })
);

router.post(
  "/neighborhoods",
  validateNeighborhood,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name, order, city } = req.body;
    await Neighborhood.create({ name, order, city });
    res.redirect("/api/neighborhoods");
  })
);

router.get(
  "/neighborhoods/edit/:id",
  asyncHandler(async (req, res) => {
    const items = await Neighborhood.findAll({ include: City });
    const cities = await City.findAll();
    const editItem = await Neighborhood.findByPk(req.params.id);
    res.render("neighborhoods", { items, cities, editItem });
  })
);

router.post(
  "/neighborhoods/edit/:id",
  validateNeighborhood,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name, order, city } = req.body;
    await Neighborhood.update(
      { name, order, city },
      { where: { id: req.params.id } }
    );
    res.redirect("/api/neighborhoods");
  })
);

router.post(
  "/neighborhoods/delete/:id",
  asyncHandler(async (req, res) => {
    await Neighborhood.destroy({ where: { id: req.params.id } });
    res.redirect("/api/neighborhoods");
  })
);

// MembershipSuspensionReason routes
router.get(
  "/suspensionreasons",
  asyncHandler(async (req, res) => {
    const items = await MembershipSuspensionReason.findAll();
    res.render("suspensionreasons", { items, editItem: null });
  })
);

router.post(
  "/suspensionreasons",
  validateMembershipSuspensionReason,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    await MembershipSuspensionReason.create({ name });
    res.redirect("/api/suspensionreasons");
  })
);

router.get(
  "/suspensionreasons/edit/:id",
  asyncHandler(async (req, res) => {
    const items = await MembershipSuspensionReason.findAll();
    const editItem = await MembershipSuspensionReason.findByPk(req.params.id);
    res.render("suspensionreasons", { items, editItem });
  })
);

router.post(
  "/suspensionreasons/edit/:id",
  validateMembershipSuspensionReason,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    await MembershipSuspensionReason.update(
      { name },
      { where: { id: req.params.id } }
    );
    res.redirect("/api/suspensionreasons");
  })
);

router.post(
  "/suspensionreasons/delete/:id",
  asyncHandler(async (req, res) => {
    await MembershipSuspensionReason.destroy({ where: { id: req.params.id } });
    res.redirect("/api/suspensionreasons");
  })
);

router.get(
  "/allentities",
  asyncHandler(async (req, res) => {
    const workDestinations = await WorkDestination.findAll();
    const membershipTypes = await MembershipType.findAll();
    const memberJobs = await MemberJob.findAll();
    const memberTitles = await MemberTitle.findAll();
    const meetingPlaces = await MeetingPlace.findAll();
    const cities = await City.findAll();
    const neighborhoods = await Neighborhood.findAll({ include: City });
    const suspensionReasons = await MembershipSuspensionReason.findAll();

    res.render("allentities", {
      workDestinations,
      membershipTypes,
      memberJobs,
      memberTitles,
      meetingPlaces,
      cities,
      neighborhoods,
      suspensionReasons,
    });
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    res.render("home");
  })
);

module.exports = router;
