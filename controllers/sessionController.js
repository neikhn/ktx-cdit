const sessionService = require("../services/sessionService");
const studentModel = require("../models/studentModel");

const sessionController = {
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
      const sessionData = { ...req.session };

      // If user is UserType 4, fetch student information
      if (sessionData.UserType === 4) {
        try {
          const student = await studentModel.getByUserId(sessionData.UserID);
          if (student) {
            sessionData.StudentID = student.StudentID;
          }
        } catch (studentError) {
          console.error("Error fetching student data:", studentError);
        }
      }

      res.status(200).json({
        message: "Session is valid",
        session: sessionData,
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
