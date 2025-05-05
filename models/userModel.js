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

  getByEmail: async (email) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request().input("Email", sql.VarChar, email)
        .query(`
            SELECT *
            FROM Users
            WHERE Email = @Email
        `);
      return result.recordset[0];
    } catch (err) {
      console.error("Error getting user by email:", err);
      throw err;
    }
  },

  getByPhoneNumber: async (phoneNumber) => {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool
        .request()
        .input("PhoneNumber", sql.VarChar, phoneNumber).query(`
          SELECT * FROM Users 
          WHERE PhoneNumber = @PhoneNumber
        `);
      return result.recordset[0];
    } catch (err) {
      console.error("Error getting user by phone number:", err);
      throw err;
    }
  },

  create: async (userData, transaction = null) => {
    try {
      const request = transaction
        ? transaction.request()
        : (await sql.connect(dbConfig)).request();

      let result = await request
        .input("FullName", sql.NVarChar, userData.FullName)
        .input("PhoneNumber", sql.VarChar, userData.PhoneNumber)
        .input("Email", sql.VarChar, userData.Email)
        .input("Password", sql.VarChar, userData.Password)
        .input("UserType", sql.Int, userData.UserType)
        .input(
          "ProfilePicture",
          sql.VarChar(sql.MAX),
          userData.ProfilePicture || null
        ).query(`
          INSERT INTO Users (
            FullName, PhoneNumber, Email, Password, 
            UserType, ProfilePicture
          )
          VALUES (@FullName, @PhoneNumber, @Email, @Password, @UserType, @ProfilePicture);
          SELECT SCOPE_IDENTITY() as UserID;
        `);
      return result.recordset[0].UserID;
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  },

  update: async (userId, userData) => {
    try {
      const pool = await sql.connect(dbConfig);

      const { Password, ...updateFields } = userData;

      const updates = Object.keys(updateFields)
        .map((key) => `${key} = @${key}`)
        .join(", ");

      const request = pool.request().input("UserID", sql.Int, userId);

      Object.entries(updateFields).forEach(([key, value]) => {
        if (key === "ProfilePicture") {
          request.input(key, sql.VarChar(sql.MAX), value);
        } else {
          request.input(key, sql.NVarChar, value);
        }
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
      console.log("Error updating user:", err);
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
