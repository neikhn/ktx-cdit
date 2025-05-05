const { roleHelper } = require("../helpers/roleHelper");
const userService = require("../services/userService");

const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.session?.UserType;

    if (!userRole) {
      return res.status(401).json({ message: "Unauthorized - No role found" });
    }

    if (!roleHelper.hasMinimumRole(userRole, requiredRole)) {
      return res.status(403).json({
        message: "Forbidden - Insufficient role level",
      });
    }

    next();
  };
};

const authorizeUserModification = async (req, res, next) => {
  try {
    const currentUserRole = req.session?.UserType;
    const currentUserId = req.session?.UserID;
    const targetUserId = parseInt(req.params.id);

    if (!currentUserRole || !currentUserId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No user session found" });
    }

    if (currentUserId === targetUserId) {
      return next();
    }

    const targetUser = await userService.getById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    if (!roleHelper.hasPermissionOver(currentUserRole, targetUser.UserType)) {
      return res.status(403).json({
        message:
          "Forbidden - Insufficient permissions to make actions this user",
      });
    }

    next();
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(500).json({
      message: "Authorization error",
      error: error.message,
    });
  }
};

module.exports = {
  authorizeRole,
  authorizeUserModification,
};
