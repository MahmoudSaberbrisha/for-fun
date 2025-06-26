const MembershipRequest = require("../models/MembershipRequest");
const Member = require("../models/Member");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Create a new membership request
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
      where: { nationalIdNumber },
    });
    if (existingRequest) {
      return res
        .status(400)
        .render("membershipLogin", { error: "طلب العضوية موجود مسبقاً" });
    }

    const newRequest = await MembershipRequest.create({
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

    res
      .status(201)
      .render("membershipLogin", { message: "تم تقديم طلب العضوية بنجاح" });
  } catch (error) {
    console.error("Error creating membership request:", error);
    res.status(500).render("membershipLogin", { error: "خطأ في الخادم" });
  }
};

// Get all membership requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await MembershipRequest.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(requests);
  } catch (error) {
    console.error("Error fetching membership requests:", error);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

// Accept a membership request and create a member
exports.acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    if (!requestId) {
      return res.status(400).json({ message: "Missing membership request id" });
    }
    const request = await MembershipRequest.findByPk(requestId);
    if (!request) {
      return res.redirect(
        "/api/members?message=" + encodeURIComponent("طلب العضوية غير موجود")
      );
    }

    // Validate nationalIdNumber: must be exactly 10 digits
    const nationalIdNumber = request.nationalIdNumber;
    if (!/^\d{10}$/.test(nationalIdNumber)) {
      return res
        .status(400)
        .json({ message: "Invalid nationalIdNumber format" });
    }

    // Validate and sanitize phoneNumber: must start with 966 followed by 9 digits
    let phoneNumber = request.phoneNumber;
    if (!phoneNumber) {
      return res.status(400).json({ message: "Missing phoneNumber" });
    }
    // Remove any non-digit characters
    phoneNumber = phoneNumber.replace(/\D/g, "");
    if (!/^966\d{9}$/.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phoneNumber format" });
    }

    const membershipNumber = uuidv4();

    const newMember = await Member.create({
      membershipNumber: membershipNumber,
      name: request.name,
      nationalIdNumber: nationalIdNumber,
      phoneNumber: phoneNumber,
      memberType: "Other",
      status: "Active",
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ),
      councilCode: "N/A",
      position: "N/A",
      appointmentDateHijri: "N/A",
      shortName: request.name.substring(0, 10),
    });

    await MembershipRequest.destroy({ where: { id: requestId } });

    res.redirect(
      "/api/members?message=" + encodeURIComponent("تم قبول الطلب وإضافة العضو")
    );
  } catch (error) {
    console.error("Error accepting membership request:", error);
    res.redirect("/api/members?message=" + encodeURIComponent("خطأ في الخادم"));
  }
};

// Reject a membership request
exports.rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    if (!requestId) {
      return res.status(400).json({ message: "Missing membership request id" });
    }
    const request = await MembershipRequest.findByPk(requestId);
    if (!request) {
      return res.redirect(
        "/api/members?message=" + encodeURIComponent("طلب العضوية غير موجود")
      );
    }

    await MembershipRequest.destroy({ where: { id: requestId } });

    res.redirect(
      "/api/members?message=" + encodeURIComponent("تم رفض الطلب وحذفه")
    );
  } catch (error) {
    console.error("Error rejecting membership request:", error);
    res.redirect("/api/members?message=" + encodeURIComponent("خطأ في الخادم"));
  }
};

// Reject a membership request
exports.rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    if (!requestId) {
      return res.status(400).json({ message: "Missing membership request id" });
    }
    const request = await MembershipRequest.findByPk(requestId);
    if (!request) {
      return res.redirect(
        "/api/members?message=" + encodeURIComponent("طلب العضوية غير موجود")
      );
    }

    await MembershipRequest.destroy({ where: { id: requestId } });

    res.redirect(
      "/api/members?message=" + encodeURIComponent("تم رفض الطلب وحذفه")
    );
  } catch (error) {
    console.error("Error rejecting membership request:", error);
    res.redirect("/api/members?message=" + encodeURIComponent("خطأ في الخادم"));
  }
};
