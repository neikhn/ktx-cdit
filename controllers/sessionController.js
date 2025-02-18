const sessionService = require("../services/sessionService");

const sessionController = {
  login: async (req, res) => {
    try {
      const userId = req.user.MaNguoiDung;

      if (!userId) {
        return res
          .status(400)
          .json({ message: "User ID not found after authentication." });
      }

      const sessionId = await sessionService.createSession(userId);

      res.cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return res
        .status(200)
        .json({ message: "Login successful, session created." });
    } catch (error) {
      console.error("Error during login/session creation:", error);
      return res
        .status(500)
        .json({ message: "Failed to create session.", error: error.message });
    }
  },

  getSessionInfo: async (req, res) => {
    try {
      const sessionId = req.cookies.sessionId; 

      if (!sessionId) {
        return res
          .status(400)
          .json({ message: "Session ID cookie is missing." }); 
      }

      const session = await sessionService.getSession(sessionId);

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

      if (!sessionId) {
        return res
          .status(400)
          .json({ message: "Session ID cookie not found for logout." });
      }

      const deleted = await sessionService.deleteSession(sessionId);

      if (deleted) {
        res.clearCookie("sessionId", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        return res.status(200).json({
          message: "Logout successful, session deleted and cookie cleared.",
        });
      } else {
        return res.status(404).json({
          message:
            "Session not found or could not be deleted (database issue).",
        });
      }
    } catch (error) {
      console.error("Error during logout/session deletion:", error);
      return res
        .status(500)
        .json({ message: "Failed to logout.", error: error.message });
    }
  },
};

module.exports = sessionController;
