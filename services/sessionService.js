const sessionModel = require("../models/sessionModel");
const { v4: uuidv4 } = require("uuid");

const sessionService = {
  createSession: async (userId) => {
    const sessionId = uuidv4();
    const sessionCreated = await sessionModel.createSession(userId, sessionId);
    if (sessionCreated) {
      return sessionId;
    } else {
      throw new Error("Failed to create session in database");
    }
  },

  getSession: async (sessionId) => {
    return await sessionModel.getSessionBySessionId(sessionId);
  },

  deleteSession: async (sessionId) => {
    return await sessionModel.deleteSessionBySessionId(sessionId);
  },
};

module.exports = sessionService;
