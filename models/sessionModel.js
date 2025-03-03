const sql = require("mssql");
const dbConfig = require("../dbConfig");

const sessionModel = {
  create: async (userId, sessionId) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool
        .request()
        .input("SessionID", sql.VarChar, sessionId)
        .input("UserID", sql.Int, userId).query(`
          INSERT INTO Sessions (SessionID, UserID)
          VALUES (@SessionID, @UserID)
        `);
      return result.rowsAffected > 0;
    } catch (err) {
      console.error("Error creating session:", err);
      throw err;
    }
  },

  get: async (sessionId) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool
        .request()
        .input("SessionID", sql.VarChar, sessionId).query(`
          SELECT *
          FROM Sessions
          WHERE SessionID = @SessionID
        `);
      return result.recordset[0];
    } catch (err) {
      console.error("Error getting session:", err);
      throw err;
    }
  },

  delete: async (sessionId) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool
        .request()
        .input("SessionID", sql.VarChar, sessionId).query(`
          DELETE FROM Sessions
          WHERE SessionID = @SessionID
        `);
      return result.rowsAffected > 0;
    } catch (err) {
      console.error("Error deleting session:", err);
      throw err;
    }
  },

  deleteExpired: async (expiryTime) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool
        .request()
        .input("ExpiryTime", sql.DateTime, expiryTime).query(`
          DELETE FROM Sessions
          WHERE CreatedAt < @ExpiryTime
        `);
      return result.rowsAffected[0];
    } catch (err) {
      console.error("Error deleting expired sessions:", err);
      throw err;
    }
  },
};

module.exports = sessionModel;
