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
    const items = await WorkDestination.find();
    res.render("workdestinations", { items, editItem: null });
  })
);

router.post(
  "/workdestinations",
  validateWorkDestination,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const item = new WorkDestination({ name, description });
    await item.save();
    res.redirect("/api/workdestinations");
  })
);

router.get(
  "/workdestinations/edit/:id",
  asyncHandler(async (req, res) => {
    const items = await WorkDestination.find();
    const editItem = await WorkDestination.findById(req.params.id);
    res.render("workdestinations", { items, editItem });
  })
);

router.post(
  "/workdestinations/edit/:id",
  validateWorkDestination,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    await WorkDestination.findByIdAndUpdate(req.params.id, {
      name,
      description,
    });
    res.redirect("/api/workdestinations");
  })
);

router.post(
  "/workdestinations/delete/:id",
  asyncHandler(async (req, res) => {
    await WorkDestination.findByIdAndDelete(req.params.id);
    res.redirect("/api/workdestinations");
  })
);

// MembershipType routes
router.get(
  "/membershiptypes",
  asyncHandler(async (req, res) => {
    const items = await MembershipType.find();
    res.render("membershiptypes", { items, editItem: null });
  })
);

router.post(
  "/membershiptypes",
  validateMembershipType,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const item = new MembershipType({ name });
    await item.save();
    res.redirect("/api/membershiptypes");
  })
);

router.get(
  "/membershiptypes/edit/:id",
  asyncHandler(async (req, res) => {
    const items = await MembershipType.find();
    const editItem = await MembershipType.findById(req.params.id);
    res.render("membershiptypes", { items, editItem });
  })
);

router.post(
  "/membershiptypes/edit/:id",
  validateMembershipType,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    await MembershipType.findByIdAndUpdate(req.params.id, { name });
    res.redirect("/api/membershiptypes");
  })
);

router.post(
  "/membershiptypes/delete/:id",
  asyncHandler(async (req, res) => {
    await MembershipType.findByIdAndDelete(req.params.id);
    res.redirect("/api/membershiptypes");
  })
);

// MemberJob routes
router.get(
  "/memberjobs",
  asyncHandler(async (req, res) => {
    const items = await MemberJob.find();
    res.render("memberjobs", { items, editItem: null });
  })
);

router.post(
  "/memberjobs",
  validateMemberJob,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const item = new MemberJob({ name });
    await item.save();
    res.redirect("/api/memberjobs");
  })
);

router.get(
  "/memberjobs/edit/:id",
  asyncHandler(async (req, res) => {
    const items = await MemberJob.find();
    const editItem = await MemberJob.findById(req.params.id);
    res.render("memberjobs", { items, editItem });
  })
);

router.post(
  "/memberjobs/edit/:id",
  validateMemberJob,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    await MemberJob.findByIdAndUpdate(req.params.id, { name });
    res.redirect("/api/memberjobs");
  })
);

router.post(
  "/memberjobs/delete/:id",
  asyncHandler(async (req, res) => {
    await MemberJob.findByIdAndDelete(req.params.id);
    res.redirect("/api/memberjobs");
  })
);

// MemberTitle routes
router.get(
  "/membertitles",
  asyncHandler(async (req, res) => {
    const items = await MemberTitle.find();
    res.render("membertitles", { items, editItem: null });
  })
);

router.post(
  "/membertitles",
  validateMemberTitle,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const item = new MemberTitle({ name });
    await item.save();
    res.redirect("/api/membertitles");
  })
);

router.get(
  "/membertitles/edit/:id",
  asyncHandler(async (req, res) => {
    const items = await MemberTitle.find();
    const editItem = await MemberTitle.findById(req.params.id);
    res.render("membertitles", { items, editItem });
  })
);

router.post(
  "/membertitles/edit/:id",
  validateMemberTitle,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    await MemberTitle.findByIdAndUpdate(req.params.id, { name });
    res.redirect("/api/membertitles");
  })
);

router.post(
  "/membertitles/delete/:id",
  asyncHandler(async (req, res) => {
    await MemberTitle.findByIdAndDelete(req.params.id);
    res.redirect("/api/membertitles");
  })
);

// MeetingPlace routes
router.get(
  "/meetingplaces",
  asyncHandler(async (req, res) => {
    const items = await MeetingPlace.find();
    res.render("meetingplaces", { items, editItem: null });
  })
);

router.post(
  "/meetingplaces",
  validateMeetingPlace,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const item = new MeetingPlace({ name });
    await item.save();
    res.redirect("/api/meetingplaces");
  })
);

router.get(
  "/meetingplaces/edit/:id",
  asyncHandler(async (req, res) => {
    const items = await MeetingPlace.find();
    const editItem = await MeetingPlace.findById(req.params.id);
    res.render("meetingplaces", { items, editItem });
  })
);

router.post(
  "/meetingplaces/edit/:id",
  validateMeetingPlace,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    await MeetingPlace.findByIdAndUpdate(req.params.id, { name });
    res.redirect("/api/meetingplaces");
  })
);

router.post(
  "/meetingplaces/delete/:id",
  asyncHandler(async (req, res) => {
    await MeetingPlace.findByIdAndDelete(req.params.id);
    res.redirect("/api/meetingplaces");
  })
);

// City routes
router.get(
  "/cities",
  asyncHandler(async (req, res) => {
    const items = await City.find();
    res.render("cities", { items, editItem: null });
  })
);

router.post(
  "/cities",
  validateCity,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name, order } = req.body;
    const item = new City({ name, order });
    await item.save();
    res.redirect("/api/cities");
  })
);

router.get(
  "/cities/edit/:id",
  asyncHandler(async (req, res) => {
    const items = await City.find();
    const editItem = await City.findById(req.params.id);
    res.render("cities", { items, editItem });
  })
);

router.post(
  "/cities/edit/:id",
  validateCity,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name, order } = req.body;
    await City.findByIdAndUpdate(req.params.id, { name, order });
    res.redirect("/api/cities");
  })
);

router.post(
  "/cities/delete/:id",
  asyncHandler(async (req, res) => {
    await City.findByIdAndDelete(req.params.id);
    res.redirect("/api/cities");
  })
);

// Neighborhood routes
router.get(
  "/neighborhoods",
  asyncHandler(async (req, res) => {
    const items = await Neighborhood.find().populate("city");
    const cities = await City.find();
    res.render("neighborhoods", { items, cities, editItem: null });
  })
);

router.post(
  "/neighborhoods",
  validateNeighborhood,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name, order, city } = req.body;
    const item = new Neighborhood({ name, order, city });
    await item.save();
    res.redirect("/api/neighborhoods");
  })
);

router.get(
  "/neighborhoods/edit/:id",
  asyncHandler(async (req, res) => {
    const items = await Neighborhood.find().populate("city");
    const cities = await City.find();
    const editItem = await Neighborhood.findById(req.params.id);
    res.render("neighborhoods", { items, cities, editItem });
  })
);

router.post(
  "/neighborhoods/edit/:id",
  validateNeighborhood,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name, order, city } = req.body;
    await Neighborhood.findByIdAndUpdate(req.params.id, { name, order, city });
    res.redirect("/api/neighborhoods");
  })
);

router.post(
  "/neighborhoods/delete/:id",
  asyncHandler(async (req, res) => {
    await Neighborhood.findByIdAndDelete(req.params.id);
    res.redirect("/api/neighborhoods");
  })
);

// MembershipSuspensionReason routes
router.get(
  "/suspensionreasons",
  asyncHandler(async (req, res) => {
    const items = await MembershipSuspensionReason.find();
    res.render("suspensionreasons", { items, editItem: null });
  })
);

router.post(
  "/suspensionreasons",
  validateMembershipSuspensionReason,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const item = new MembershipSuspensionReason({ name });
    await item.save();
    res.redirect("/api/suspensionreasons");
  })
);

router.get(
  "/suspensionreasons/edit/:id",
  asyncHandler(async (req, res) => {
    const items = await MembershipSuspensionReason.find();
    const editItem = await MembershipSuspensionReason.findById(req.params.id);
    res.render("suspensionreasons", { items, editItem });
  })
);

router.post(
  "/suspensionreasons/edit/:id",
  validateMembershipSuspensionReason,
  checkValidation,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    await MembershipSuspensionReason.findByIdAndUpdate(req.params.id, { name });
    res.redirect("/api/suspensionreasons");
  })
);

router.post(
  "/suspensionreasons/delete/:id",
  asyncHandler(async (req, res) => {
    await MembershipSuspensionReason.findByIdAndDelete(req.params.id);
    res.redirect("/api/suspensionreasons");
  })
);

router.get(
  "/allentities",
  asyncHandler(async (req, res) => {
    const workDestinations = await WorkDestination.find();
    const membershipTypes = await MembershipType.find();
    const memberJobs = await MemberJob.find();
    const memberTitles = await MemberTitle.find();
    const meetingPlaces = await MeetingPlace.find();
    const cities = await City.find();
    const neighborhoods = await Neighborhood.find().populate("city");
    const suspensionReasons = await MembershipSuspensionReason.find();

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
