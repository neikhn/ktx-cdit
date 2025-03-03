const sessionModel = require("../models/sessionModel");
const { v4: uuidv4 } = require("uuid");

const SESSION_EXPIRY_HOURS = process.env.SESSION_EXPIRY_HOURS || 24;

const sessionService = {
  create: async (userId) => {
    const sessionId = uuidv4();
    const sessionCreated = await sessionModel.create(userId, sessionId);
    if (sessionCreated) {
      return sessionId;
    } else {
      throw new Error("Failed to create session in database");
    }
  },

  get: async (sessionId) => {
    return await sessionModel.get(sessionId);
  },

  delete: async (sessionId) => {
    return await sessionModel.delete(sessionId);
  },

  cleanupExpired: async () => {
    const expiryTime = new Date(
      Date.now() - SESSION_EXPIRY_HOURS * 60 * 60 * 1000
    );
    const deletedCount = await sessionModel.deleteExpired(expiryTime);
    console.log(`Cleaned up ${deletedCount} expired sessions`);
    return deletedCount;
  },
};

module.exports = sessionService;
