const MembershipRequest = require("../models/MembershipRequest");
const Member = require("../models/Member");
const fs = require("fs");
const path = require("path");

exports.createRequest = async (req, res) => {
  try {
    const {
      name,
      nationalIdNumber,
      gender,
      birthDate,
      city,
      phoneNumber,
      email,
      education,
      profession,
      isEmployee,
      isSupplier,
      pledge,
    } = req.body;

    let cvFilePath = null;
    if (req.file) {
      cvFilePath = req.file.path;
    }

    const existingRequest = await MembershipRequest.findOne({
      nationalIdNumber,
    });
    if (existingRequest) {
      return res
        .status(400)
        .render("membershipLogin", { error: "طلب العضوية موجود مسبقاً" });
    }

    const newRequest = new MembershipRequest({
      name,
      nationalIdNumber,
      gender,
      birthDate,
      city,
      phoneNumber,
      email,
      education,
      profession,
      cvFilePath,
      isEmployee: isEmployee === "on",
      isSupplier: isSupplier === "on",
      pledge: pledge === "on",
    });

    await newRequest.save();
    res
      .status(201)
      .render("membershipLogin", { message: "تم تقديم طلب العضوية بنجاح" });
  } catch (error) {
    console.error("Error creating membership request:", error);
    res.status(500).render("membershipLogin", { error: "خطأ في الخادم" });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await MembershipRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error("Error fetching membership requests:", error);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

const { v4: uuidv4 } = require("uuid");

exports.acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await MembershipRequest.findById(requestId);
    if (!request) {
      return res.redirect(
        "/api/members?message=" + encodeURIComponent("طلب العضوية غير موجود")
      );
    }

    // Generate unique membership number using UUID
    const membershipNumber = uuidv4();

    // Create new member from request data
    const newMember = new Member({
      membershipNumber: membershipNumber,
      name: request.name,
      nationalIdNumber: Number(request.nationalIdNumber),
      phoneNumber: request.phoneNumber,
      memberType: "Other", // Default or adjust as needed
      status: "Active",
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ),
      councilCode: "N/A",
      position: "N/A",
      appointmentDateHijri: "N/A",
      shortName: request.name.substring(0, 10), // Short name from name
    });

    await newMember.save();

    // Delete the membership request
    await MembershipRequest.findByIdAndDelete(requestId);

    res.redirect(
      "/api/members?message=" + encodeURIComponent("تم قبول الطلب وإضافة العضو")
    );
  } catch (error) {
    console.error("Error accepting membership request:", error);
    res.redirect("/api/members?message=" + encodeURIComponent("خطأ في الخادم"));
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await MembershipRequest.findById(requestId);
    if (!request) {
      return res.redirect(
        "/api/members?message=" + encodeURIComponent("طلب العضوية غير موجود")
      );
    }

    // Delete the membership request
    await MembershipRequest.findByIdAndDelete(requestId);

    res.redirect(
      "/api/members?message=" + encodeURIComponent("تم رفض الطلب وحذفه")
    );
  } catch (error) {
    console.error("Error rejecting membership request:", error);
    res.redirect("/api/members?message=" + encodeURIComponent("خطأ في الخادم"));
  }
};
