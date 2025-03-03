const sessionService = require("../services/sessionService");

const sessionController = {
  // login: async (req, res) => {
  //   try {
  //     const userId = req.user.UserID;
  //     const sessionId = await sessionService.create(userId);

  //     res.cookie("sessionId", sessionId, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       sameSite: "strict"
  //     });

  //     res.status(200).json({
  //       message: "Session created successfully"
  //     });
  //   } catch (error) {
  //     console.error("Error creating session:", error);
  //     res.status(500).json({
  //       message: "Failed to create session",
  //       error: error.message
  //     });
  //   }
  // },
  getInfo: async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;

      if (!sessionId) {
        return res
          .status(400)
          .json({ message: "Session ID cookie is missing." });
      }

      const session = await sessionService.get(sessionId);

      if (session) {
        return res
          .status(200)
          .json({ message: "Session found", session: session });
      } else {
        return res.status(404).json({ message: "Session not found" });
      }
    } catch (error) {
      console.error("Error getting session info:", error);
      return res.status(500).json({
        message: "Failed to get session information.",
        error: error.message,
      });
    }
  },

  logout: async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId;
      await sessionService.delete(sessionId);

      res.clearCookie("sessionId");
      res.status(200).json({
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      res.status(500).json({
        message: "Failed to logout",
        error: error.message,
      });
    }
  },

  check: async (req, res) => {
    try {
      // If we get here, the session is valid (checked by authenticateSession middleware)
      res.status(200).json({
        message: "Session is valid",
        session: req.session,
      });
    } catch (error) {
      console.error("Error checking session:", error);
      res.status(500).json({
        message: "Failed to check session",
        error: error.message,
      });
    }
  },
};

module.exports = sessionController;
