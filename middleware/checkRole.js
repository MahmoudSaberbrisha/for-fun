const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    console.log("User role:", req.userRole);
    console.log("Allowed roles:", allowedRoles);
    if (!req.userRole) {
      return res.status(403).json({ message: "User role not found" });
    }
    if (!allowedRoles.includes(req.userRole)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient role" });
    }
    next();
  };
};

module.exports = checkRole;
