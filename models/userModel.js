const sql = require("mssql");
const dbConfig = require("../dbConfig");

const userModel = {
  getUserById: async (userId) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request()
        .input("UserID", sql.Int, userId)
        .query(`
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

  getUserByUsername: async (username) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request()
        .input("Username", sql.VarChar, username)
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

  createUser: async (userData) => {
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
        .input("UserType", sql.Int, userData.UserType)
        .query(`
            INSERT INTO Users (FullName, Username, PhoneNumber, Email, QRCode, Password, UserType)
            VALUES (@FullName, @Username, @PhoneNumber, @Email, @QRCode, @Password, @UserType);
            SELECT * FROM Users WHERE UserID = SCOPE_IDENTITY();
        `);
      return result.recordset[0]; // Return the newly created user object
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  },
};

module.exports = userModel;
