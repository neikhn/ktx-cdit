const sql = require("mssql");
const dbConfig = require("../dbConfig");

const sessionModel = {
  createSession: async (userId, sessionId) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool
        .request()
        .input("MaPhien", sql.VarChar, sessionId)
        .input("MaNguoiDung", sql.Int, userId)
        .query(`
                INSERT INTO Phien (MaPhien, MaNguoiDung)
                VALUES (@MaPhien, @MaNguoiDung)
                `);
      return result.rowsAffected > 0;
    } catch (err) {
      console.error("Error creating session:", err);
      throw err;
    }
  },

  getSessionBySessionId: async (sessionId) => {
    try {
      let pool = await sql.connect(dbConfig); 
      let result = await pool.request().input("MaPhien", sql.VarChar, sessionId)
        .query(`
                SELECT *
                FROM Phien
                WHERE MaPhien = @MaPhien
                `);
      return result.recordset[0];
    } catch (err) {
      console.error("Error getting session by ID:", err);
      throw err;
    }
  },

  deleteSessionBySessionId: async (sessionId) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request().input("MaPhien", sql.VarChar, sessionId)
        .query(`
                DELETE FROM Phien
                WHERE MaPhien = @MaPhien
                `);
      return result.rowsAffected > 0;
    } catch (err) {
      console.error("Error deleting session:", err);
      throw err;
    }
  },
};

module.exports = sessionModel;
