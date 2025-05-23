const express = require("express");
const router = express.Router();
const subscriptionLogController = require("../Controllers/SubscriptionLogController");

// Route to get all subscription logs and render view
router.get("/subscription-logs", subscriptionLogController.getSubscriptionLogs);

// Route to render the add subscription log form
router.get(
  "/subscription-logs/add",
  subscriptionLogController.renderAddSubscriptionLogForm
);

// Route to handle form submission for adding subscription log
router.post(
  "/subscription-logs/add",
  subscriptionLogController.handleAddSubscriptionLogForm
);

// Route to add a new subscription log (expects JSON body)
router.post("/subscription-logs", subscriptionLogController.addSubscriptionLog);

// New route for member subscription payment screen
router.get(
  "/member-subscriptions/payment",
  subscriptionLogController.getMemberSubscriptionPaymentScreen
);

// New POST route to handle subscription payment form submission
router.post(
  "/member-subscriptions/payment/submit",
  subscriptionLogController.handleMemberSubscriptionPayment
);

module.exports = router;
