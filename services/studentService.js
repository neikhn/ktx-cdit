const userService = require("../services/userService");
const studentModel = require("../models/studentModel");
const studentHelper = require("../helpers/studentHelper");
const sql = require("mssql");
const dbConfig = require("../dbConfig");
const { UserRoles } = require("../helpers/roleHelper");

const studentService = {
  getAll: async () => {
    return await studentModel.getAll();
  },

  getById: async (studentId) => {
    return await studentModel.getById(studentId);
  },

  createStudentAccount: async (userData, studentData) => {
    let pool = null;
    let transaction = null;

    try {
      pool = await new sql.ConnectionPool(dbConfig).connect();
      transaction = new sql.Transaction(pool);
      await transaction.begin();

      userData.UserType = UserRoles.STUDENT;

      studentHelper.validateStudentData(studentData, true);

      const userId = await userService.create(userData, transaction);
      console.log("Created user with ID:", userId);

      if (!userId) {
        throw new Error("Failed to create user account");
      }

      const preparedStudentData = studentHelper.prepareStudentData(
        userId,
        studentData
      );
      console.log("Prepared student data:", preparedStudentData);

      const student = await studentModel.create(
        preparedStudentData,
        transaction
      );

      if (!student) {
        throw new Error("Failed to create student record");
      }

      await transaction.commit();
      console.log("Transaction committed successfully");

      return {
        userId,
        student,
      };
    } catch (error) {
      console.error("Error creating student account:", error);
      if (transaction) {
        try {
          await transaction.rollback();
          console.log("Transaction rolled back successfully");
        } catch (rollbackError) {
          console.error("Error rolling back transaction:", rollbackError);
        }
      }
      throw new Error(`Error creating student account: ${error.message}`);
    } finally {
      if (pool) {
        try {
          pool.close();
        } catch (closeError) {
          console.error("Error closing connection pool:", closeError);
        }
      }
    }
  },

  update: async (studentId, updateData) => {
    const existingStudent = await studentModel.getById(studentId);
    if (!existingStudent) {
      throw new Error("Student not found");
    }

    if (updateData.UserID && updateData.UserID !== existingStudent.UserID) {
      const user = await userService.getById(updateData.UserID);
      if (!user || user.UserType !== UserRoles.STUDENT) {
        throw new Error("Invalid user ID or user is not a student");
      }
    }

    try {
      studentHelper.validateStudentData(updateData, false);
    } catch (error) {
      throw new Error(`Validation error: ${error.message}`);
    }

    return await studentModel.update(studentId, updateData);
  },

  delete: async (studentId) => {
    const student = await studentModel.getById(studentId);
    if (!student) {
      return null;
    }

    return await studentModel.delete(studentId);
  },
};

module.exports = studentService;
