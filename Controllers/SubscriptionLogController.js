const SubscriptionLog = require("../models/SubscriptionLog");

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

    const newLog = new SubscriptionLog(newLogData);

    await newLog.save();
    res
      .status(201)
      .json({ message: "Subscription log added successfully", log: newLog });
  } catch (error) {
    console.error("Error adding subscription log:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSubscriptionLogs = async (req, res) => {
  try {
    const logs = await SubscriptionLog.find().sort({ date: -1 });
    res.render("subscriptionLogs", { logs });
  } catch (error) {
    console.error("Error fetching subscription logs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.renderAddSubscriptionLogForm = (req, res) => {
  res.render("addSubscriptionLog", {
    lang: res.locals.lang,
    memberId: req.userId,
  });
};

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

    const newLog = new SubscriptionLog(newLogData);
    await newLog.save();

    res.redirect("/subscription-logs");
  } catch (error) {
    console.error("Error adding subscription log:", error);
    console.error(error.stack);
    res.status(500).send("Server error");
  }
};

exports.getMemberSubscriptionPaymentScreen = async (req, res) => {
  try {
    const memberId = req.userId;
    if (!memberId) {
      return res.status(401).send("Unauthorized: Member not logged in");
    }

    const dueSubscriptions = await SubscriptionLog.find({
      memberId,
      operationType: "استحقاق",
    }).sort({ startYear: 1 });

    res.render("memberSubscriptionPayment", { dueSubscriptions });
  } catch (error) {
    console.error("Error fetching member subscription payments:", error);
    res.status(500).send("Server error");
  }
};

// New method to handle subscription payment form submission
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

    // Normalize subscriptionIds to array
    const idsArray = Array.isArray(subscriptionIds)
      ? subscriptionIds
      : [subscriptionIds];

    // For each selected subscription, create a new "سداد" (payment) log entry
    const paymentLogs = idsArray.map((subId) => ({
      memberId,
      subscriptionValue: 0, // or fetch actual value if needed
      date: new Date(),
      operationType: "سداد",
      startYear: 0,
      endYear: 0,
      description: `سداد اشتراك رقم ${subId}`,
    }));

    await SubscriptionLog.insertMany(paymentLogs);

    res.redirect("/member-subscriptions/payment");
  } catch (error) {
    console.error("Error processing subscription payment:", error);
    res.status(500).send("Server error");
  }
};
