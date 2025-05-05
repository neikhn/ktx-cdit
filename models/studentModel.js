const sql = require("mssql");
const dbConfig = require("../dbConfig");
const { update } = require("./userModel");

const studentModel = {
  getById: async (studentId) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool
        .request()
        .input("StudentID", sql.VarChar(20), studentId).query(`
							SELECT Students.*, Users.FullName, Users.Email, Users.PhoneNumber
							FROM Students 
							JOIN Users ON Students.UserID = Users.UserID
							WHERE Students.StudentID = @StudentID
					`);
      return result.recordset[0];
    } catch (err) {
      console.log("Error getting student by ID:", err);
      throw err;
    }
  },

  getByEmail: async (email) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request().input("Email", sql.VarChar, email)
        .query(`
              SELECT * 
              FROM Students
              WHERE Email = @Email
          `);
      return result.recordset[0];
    } catch (err) {
      console.error("Error getting student by email:", err);
      throw err;
    }
  },

  create: async (studentData, transaction = null) => {
    try {
      const request = transaction
        ? transaction.request()
        : (await sql.connect(dbConfig)).request();

      let result = await request
        .input("StudentId", sql.VarChar(20), studentData.StudentId)
        .input("DateOfBirth", sql.Date, studentData.DateOfBirth)
        .input("Gender", sql.NVarChar(10), studentData.Gender)
        .input("StudentType", sql.NVarChar(20), studentData.StudentType)
        .input("AcademicYear", sql.NVarChar(20), studentData.AcademicYear)
        .input("UserID", sql.Int, studentData.UserID).query(`
          INSERT INTO Students (StudentId, DateOfBirth, Gender, StudentType, AcademicYear, UserID)
          VALUES (@StudentId, @DateOfBirth, @Gender, @StudentType, @AcademicYear, @UserID);
          
          SELECT s.*, u.FullName, u.Email, u.PhoneNumber
          FROM Students s
          JOIN Users u ON s.UserID = u.UserID
          WHERE s.StudentId = @StudentId;
        `);
      return result.recordset[0];
    } catch (err) {
      console.error("Error creating student:", err);
      throw err;
    }
  },

  update: async (studentId, studentData) => {
    try {
      const pool = await sql.connect(dbConfig);
      const request = pool.request();
      const updates = Object.keys(studentData)
        .map((key) => `${key} = @${key}`)
        .join(", ");

      Object.entries(studentData).forEach(([key, value]) => {
        switch (key) {
          case "DateOfBirth":
            request.input(key, sql.Date, value);
            break;
          case "UserID":
            request.input(key, sql.Int, value);
            break;
          default:
            request.input(key, sql.NVarChar, value);
        }
      });

      const result = await request.input(
        "StudentID",
        sql.VarChar(20),
        studentId
      ).query(`
            UPDATE Students
            SET ${updates}
            OUTPUT INSERTED.*
            WHERE StudentID = @StudentID;
        `);
      return result.recordset[0];
    } catch (err) {
      console.error("Error updating student:", err);
      throw err;
    }
  },

  getAll: async () => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request().query(`
              SELECT Students.*, Users.FullName, Users.Email, Users.PhoneNumber
              FROM Students
              JOIN Users ON Students.UserID = Users.UserID
          `);
      return result.recordset;
    } catch (err) {
      console.error("Error getting all students:", err);
      throw err;
    }
  },

  delete: async (studentId) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool
        .request()
        .input("StudentID", sql.VarChar(20), studentId).query(`
              DELETE
              FROM Students
              WHERE StudentID = @StudentID;
          `);
    } catch (err) {
      console.log("Error deleting student:", err);
      throw err;
    }
  },

  getByUserId: async (userId) => {
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request().input("UserID", sql.Int, userId)
        .query(`
          SELECT s.*, u.FullName, u.Email, u.PhoneNumber
          FROM Students s
          JOIN Users u ON s.UserID = u.UserID
          WHERE s.UserID = @UserID
        `);

      return result.recordset[0];
    } catch (err) {
      console.error("Error getting student by user ID:", err);
      throw err;
    }
  },
};

module.exports = studentModel;
