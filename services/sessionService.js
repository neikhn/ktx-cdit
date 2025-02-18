const sessionModel = require("../models/sessionModel");
const { v4: uuidv4 } = require("uuid");

const SESSION_EXPIRY_HOURS = process.env.SESSION_EXPIRY_HOURS || 24;

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
    return await sessionModel.getSession(sessionId);
  },

  deleteSession: async (sessionId) => {
    return await sessionModel.deleteSession(sessionId);
  },

  cleanupExpiredSessions: async () => {
    const expiryTime = new Date(Date.now() - (SESSION_EXPIRY_HOURS * 60 * 60 * 1000));
    const deletedCount = await sessionModel.deleteExpiredSessions(expiryTime);
    console.log(`Cleaned up ${deletedCount} expired sessions`);
    return deletedCount;
  }
};

module.exports = sessionService;
