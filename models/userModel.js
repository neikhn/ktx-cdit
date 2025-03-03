const sql = require("mssql");
const dbConfig = require("../dbConfig");

const userModel = {
  getById: async (userId) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request().input("UserID", sql.Int, userId).query(`
            SELECT *
            FROM Users
            WHERE UserID = @UserID
        `);
      return result.recordset[0];
    } catch (err) {
      console.error("Error getting user by ID:", err);
      throw err;
    }
  },

  getByUsername: async (username) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request().input("Username", sql.VarChar, username)
        .query(`
            SELECT *
            FROM Users
            WHERE Username = @Username
        `);
      return result.recordset[0];
    } catch (err) {
      console.error("Error getting user by username:", err);
      throw err;
    }
  },

  create: async (userData) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool
        .request()
        .input("FullName", sql.NVarChar, userData.FullName)
        .input("Username", sql.VarChar, userData.Username)
        .input("PhoneNumber", sql.VarChar, userData.PhoneNumber)
        .input("Email", sql.VarChar, userData.Email)
        .input("QRCode", sql.VarChar, userData.QRCode)
        .input("Password", sql.VarChar, userData.Password) // Hashed password will be passed here from service
        .input("UserType", sql.Int, userData.UserType).query(`
            INSERT INTO Users (FullName, Username, PhoneNumber, Email, QRCode, Password, UserType)
            VALUES (@FullName, @Username, @PhoneNumber, @Email, @QRCode, @Password, @UserType);
            SELECT * FROM Users WHERE UserID = SCOPE_IDENTITY();
        `);
      return result.recordset[0]; // Return created user object
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  },

  update: async (userId, userData) => {
    try {
      const pool = await sql.connect(dbConfig);

      // Remove password from update if not provided
      const { Password, ...updateFields } = userData;

      // Building SET only for provided fields
      const updates = Object.keys(updateFields)
        .map((key) => `${key} = @${key}`)
        .join(", ");

      const request = pool.request().input("UserID", sql.Int, userId);

      // Add parameters for each field being updated
      Object.entries(updateFields).forEach(([key, value]) => {
        request.input(key, sql.NVarChar, value);
      });

      const query = `
            UPDATE Users 
            SET ${updates}
            OUTPUT INSERTED.*
            WHERE UserID = @UserID;
        `;

      const result = await request.query(query);
      return result.recordset[0];
    } catch (err) {
      throw err;
    }
  },

  getAll: async () => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request().query(`
            SELECT *
            FROM Users
        `);
      return result.recordset;
    } catch (err) {
      console.error("Error getting all users:", err);
      throw err;
    }
  },

  delete: async (userId) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request().input("UserID", sql.Int, userId).query(`
          DELETE FROM Users
          OUTPUT DELETED.*
          WHERE UserID = @UserID;
        `);

      return result.recordset[0];
    } catch (err) {
      console.error("Error deleting user:", err);
      throw err;
    }
  },
};

module.exports = userModel;
