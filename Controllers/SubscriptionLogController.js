const SubscriptionLog = require("../models/SubscriptionLog");
const Member = require("../models/Member");

// Add a subscription log
exports.addSubscriptionLog = async (req, res) => {
  try {
    const {
      subscriptionValue,
      date,
      operationType,
      startYear,
      endYear,
      receiptDate,
      receiptNumber,
      paymentMethod,
      description,
      memberId,
    } = req.body;

    if (
      !subscriptionValue ||
      !operationType ||
      !startYear ||
      !endYear ||
      !memberId
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newLogData = {
      subscriptionValue,
      date: date ? new Date(date) : new Date(),
      operationType,
      startYear,
      endYear,
      memberId,
    };

    if (operationType === "سداد") {
      newLogData.receiptDate = receiptDate ? new Date(receiptDate) : undefined;
      newLogData.receiptNumber = receiptNumber;
      newLogData.paymentMethod = paymentMethod;
      newLogData.description = description;
    }

    const newLog = await SubscriptionLog.create(newLogData);
    res
      .status(201)
      .json({ message: "Subscription log added successfully", log: newLog });
  } catch (error) {
    console.error("Error adding subscription log:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all subscription logs
exports.getSubscriptionLogs = async (req, res) => {
  try {
    const logs = await SubscriptionLog.findAll({
      order: [["date", "DESC"]],
      include: [{ model: Member, as: "member" }],
    });
    res.render("subscriptionLogs", { logs });
  } catch (error) {
    console.error("Error fetching subscription logs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Render add subscription log form
exports.renderAddSubscriptionLogForm = (req, res) => {
  res.render("addSubscriptionLog", {
    lang: res.locals.lang,
    memberId: req.userId,
  });
};

// Handle add subscription log form submission
exports.handleAddSubscriptionLogForm = async (req, res) => {
  try {
    const {
      subscriptionValue,
      date,
      operationType,
      startYear,
      endYear,
      receiptDate,
      receiptNumber,
      paymentMethod,
      description,
      memberId,
    } = req.body;

    if (
      !subscriptionValue ||
      !operationType ||
      !startYear ||
      !endYear ||
      !memberId
    ) {
      return res.status(400).send("Missing required fields");
    }

    const newLogData = {
      subscriptionValue,
      date: date ? new Date(date) : new Date(),
      operationType,
      startYear,
      endYear,
      memberId,
    };

    if (operationType === "سداد") {
      newLogData.receiptDate = receiptDate ? new Date(receiptDate) : undefined;
      newLogData.receiptNumber = receiptNumber;
      newLogData.paymentMethod = paymentMethod;
      newLogData.description = description;
    }

    await SubscriptionLog.create(newLogData);

    res.redirect("/subscription-logs");
  } catch (error) {
    console.error("Error adding subscription log:", error);
    console.error(error.stack);
    res.status(500).send("Server error");
  }
};

// Get member subscription payment screen
exports.getMemberSubscriptionPaymentScreen = async (req, res) => {
  try {
    const memberId = req.userId;
    if (!memberId) {
      return res.status(401).send("Unauthorized: Member not logged in");
    }

    const dueSubscriptions = await SubscriptionLog.findAll({
      where: { memberId, operationType: "استحقاق" },
      order: [["startYear", "ASC"]],
    });

    res.render("memberSubscriptionPayment", { dueSubscriptions });
  } catch (error) {
    console.error("Error fetching member subscription payments:", error);
    res.status(500).send("Server error");
  }
};

// Handle subscription payment form submission
exports.handleMemberSubscriptionPayment = async (req, res) => {
  try {
    const memberId = req.userId;
    if (!memberId) {
      return res.status(401).send("Unauthorized: Member not logged in");
    }

    const subscriptionIds = req.body.subscriptionIds;
    if (!subscriptionIds) {
      return res.status(400).send("No subscriptions selected for payment");
    }

    const idsArray = Array.isArray(subscriptionIds)
      ? subscriptionIds
      : [subscriptionIds];

    const paymentLogs = idsArray.map((subId) => ({
      memberId,
      subscriptionValue: 0,
      date: new Date(),
      operationType: "سداد",
      startYear: 0,
      endYear: 0,
      description: `سداد اشتراك رقم ${subId}`,
    }));

    await SubscriptionLog.bulkCreate(paymentLogs);

    res.redirect("/member-subscriptions/payment");
  } catch (error) {
    console.error("Error processing subscription payment:", error);
    res.status(500).send("Server error");
  }
};
