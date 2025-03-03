const sessionService = require("../services/sessionService");
const userService = require("../services/userService");

const authenticateSession = async (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      return res.status(401).json({ message: "No session cookie found" });
    }

    const session = await sessionService.get(sessionId);

    if (!session) {
      return res.status(401).json({ message: "Invalid or expired session" });
    }

    // Get user data and attach to request
    const user = await userService.getById(session.UserID);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach session and user info to request object
    req.session = {
      SessionID: sessionId,
      UserID: user.UserID,
      UserType: user.UserType,
    };

    next();
  } catch (error) {
    console.error("Session authentication error:", error);
    res.status(500).json({
      message: "Authentication error",
      error: error.message,
    });
  }
};

module.exports = { authenticateSession };
