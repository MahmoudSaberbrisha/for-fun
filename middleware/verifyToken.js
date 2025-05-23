const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Check token in Authorization header
  let token = req.headers.authorization?.split(" ")[1];

  // If not found in header, check in cookies
  if (!token && req.cookies) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.redirect("/membership-login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.memberType; // Attach user role from token payload
    next();
  } catch (error) {
    return res.redirect("/membership-login");
  }
};

module.exports = verifyToken;
