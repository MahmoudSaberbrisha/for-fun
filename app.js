require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const entitiesRouter = require("./routes/Definitions/entities");
const breakingNewsRouter = require("./routes/Definitions/breakingNewsRoute");
const memberRouter = require("./routes/Definitions/MemberRoute");
const membershipRequestRouter = require("./routes/MembershipRequestRoute");
const memberJobRouter = require("./routes/Definitions/MemberJobRoute");
const sessionRouter = require("./routes/Definitions/SessionRoute");
const votingRouter = require("./routes/Definitions/VotingRoute");
const boardMeetingRouter = require("./routes/Definitions/BoardMeetingRoute");
const attendanceRouter = require("./routes/Definitions/AttendanceRoute");
const minuteRouter = require("./routes/Definitions/MinuteRoute");
const sequelize = require("./sequelize");
const i18nMiddleware = require("./middleware/i18n");
const { getBreakingNewsView } = require("./Controllers/breakingNewsController");
const verifyToken = require("./middleware/verifyToken");

const app = express();

const subscriptionLogRoute = require("./routes/SubscriptionLogRoute");

// Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Use i18n middleware
app.use(i18nMiddleware);

// Middleware to protect routes except /membership-login, /logout, /api/members/login, and /api/membership-requests
app.use((req, res, next) => {
  const publicPaths = [
    "/membership-login",
    "/logout",
    "/api/members/login",
    "/api/membership-requests",
  ];
  if (
    publicPaths.includes(req.path) ||
    req.path.startsWith("/frontend") ||
    req.path.startsWith("/public")
  ) {
    return next();
  }
  verifyToken(req, res, next);
});

app.use("/", subscriptionLogRoute);

// Serve static files from frontend directory
app.use("/frontend", express.static(path.join(__dirname, "frontend")));

// Serve static files from public directory (for uploads and others)
app.use(express.static(path.join(__dirname, "public")));

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// API routes
app.use("/api", entitiesRouter);
app.use("/api/breakingnews", breakingNewsRouter);
app.use("/api/members", memberRouter);
app.use("/api/membership-requests", membershipRequestRouter);
app.use("/api/memberjobs", memberJobRouter);
app.use("/api", sessionRouter);
app.use("/api", votingRouter);
app.use("/api", attendanceRouter);
app.use("/api", minuteRouter);
app.use("/", boardMeetingRouter);

const opinionPollRouter = require("./routes/Definitions/OpinionPollRoute");
const invitationRouter = require("./routes/Definitions/InvitationRoute");
const discussionRouter = require("./routes/Definitions/DiscussionRoute");
const citiesRouter = require("./routes/Definitions/CitiesRoute");

app.use("/api/opinionPolls", opinionPollRouter);

const boardRouter = require("./routes/Definitions/BoardRoute");
app.use("/api", boardRouter);

app.use("/", invitationRouter);
app.use("/", discussionRouter);
app.use("/", citiesRouter);

// Redirect /api/inactiveMembers to /api/members/inactive
app.get("/api/inactiveMembers", (req, res) => {
  res.redirect("/api/members/inactive");
});

// Add route to render breakingnews view page
app.get("/breakingnews", getBreakingNewsView);

app.get("/boards", (req, res) => {
  res.redirect("/api/boards");
});

// Remove static frontend serving and page routes as we will use EJS views

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Connection with MySQL is successful");
    const port = process.env.PORT || 2000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MySQL:", error);
  }
}

app.get("/", (req, res) => {
  res.redirect("/membership-login");
});

app.get("/membership-login", (req, res) => {
  res.render("membershipLogin");
});

// Logout route to clear token cookie and redirect to login page
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/membership-login");
});

connectToDatabase();
