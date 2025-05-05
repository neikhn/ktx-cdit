const sql = require("mssql");
const dbConfig = require("../dbConfig");

const residenceRegistrationModel = {
  getAll: async () => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request().query(`
        SELECT *
        FROM ResidenceRegistrations
        ORDER BY RegistrationDate DESC
      `);
      return result.recordset;
    } catch (err) {
      console.error("Error getting all registrations:", err);
      throw err;
    }
  },

  getById: async (registrationId) => {
    try {
      console.log("Getting registration by ID:", registrationId);
      let pool = await sql.connect(dbConfig);
      let result = await pool
        .request()
        .input("RegistrationID", sql.Int, registrationId).query(`
          SELECT *
          FROM ResidenceRegistrations
          WHERE RegistrationID = @RegistrationID
        `);
      console.log("Query result:", result.recordset);
      return result.recordset[0];
    } catch (err) {
      console.error("Error getting registration by ID:", err);
      throw err;
    }
  },

  getByStudentId: async (studentId) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool
        .request()
        .input("StudentID", sql.VarChar(20), studentId).query(`
          SELECT *
          FROM ResidenceRegistrations
          WHERE StudentID = @StudentID
          ORDER BY RegistrationDate DESC
        `);
      return result.recordset;
    } catch (err) {
      console.error("Error getting registrations by student ID:", err);
      throw err;
    }
  },

  getByRoomId: async (roomId) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request().input("RoomID", sql.VarChar(20), roomId)
        .query(`
          SELECT *
          FROM ResidenceRegistrations
          WHERE RoomID = @RoomID
          ORDER BY RegistrationDate DESC
        `);
      return result.recordset;
    } catch (err) {
      console.error("Error getting registrations by room ID:", err);
      throw err;
    }
  },

  create: async (registrationData, transaction = null) => {
    try {
      let request;
      if (transaction) {
        request = transaction.request();
      } else {
        const pool = await sql.connect(dbConfig);
        request = pool.request();
      }

      let result = await request
        .input("StudentID", sql.VarChar(20), registrationData.StudentID)
        .input("RoomID", sql.VarChar(20), registrationData.RoomID)
        .input("RegistrationDate", sql.Date, registrationData.RegistrationDate)
        .input("CheckInDate", sql.Date, registrationData.CheckInDate)
        .input("CheckOutDate", sql.Date, registrationData.CheckOutDate)
        .input(
          "RegistrationStatus",
          sql.NVarChar(20),
          registrationData.RegistrationStatus
        ).query(`
      INSERT INTO ResidenceRegistrations (
            StudentID, RoomID, RegistrationDate, CheckInDate, CheckOutDate, RegistrationStatus
          )
          OUTPUT INSERTED.*
          VALUES (
            @StudentID, @RoomID, @RegistrationDate, @CheckInDate, @CheckOutDate, @RegistrationStatus
          )
        `);
      return result.recordset[0];
    } catch (err) {
      console.error("Error creating registration:", err);
      throw err;
    }
  },

  update: async (registrationId, registrationData, transaction = null) => {
    try {
      let request;
      if (transaction) {
        request = transaction.request();
      } else {
        const pool = await sql.connect(dbConfig);
        request = pool.request();
      }

      let updateFields = [];
      if (registrationData.StudentID !== undefined) {
        request.input("StudentID", sql.VarChar(20), registrationData.StudentID);
        updateFields.push("StudentID = @StudentID");
      }

      if (registrationData.RoomID !== undefined) {
        request.input("RoomID", sql.VarChar(20), registrationData.RoomID);
        updateFields.push("RoomID = @RoomID");
      }

      if (registrationData.RegistrationDate !== undefined) {
        request.input(
          "RegistrationDate",
          sql.Date,
          registrationData.RegistrationDate
        );
        updateFields.push("RegistrationDate = @RegistrationDate");
      }

      if (registrationData.CheckInDate !== undefined) {
        request.input("CheckInDate", sql.Date, registrationData.CheckInDate);
        updateFields.push("CheckInDate = @CheckInDate");
      }

      if (registrationData.CheckOutDate !== undefined) {
        request.input("CheckOutDate", sql.Date, registrationData.CheckOutDate);
        updateFields.push("CheckOutDate = @CheckOutDate");
      }

      if (
        registrationData.RegistrationStatus !== undefined ||
        registrationData.registrationStatus !== undefined
      ) {
        const status =
          registrationData.RegistrationStatus ||
          registrationData.registrationStatus;
        request.input("RegistrationStatus", sql.NVarChar(20), status);
        updateFields.push("RegistrationStatus = @RegistrationStatus");
      }

      if (updateFields.length === 0) {
        throw new Error("No fields to update");
      }

      request.input("RegistrationID", sql.Int, registrationId);

      const result = await request.query(`
        UPDATE ResidenceRegistrations
        SET ${updateFields.join(", ")}
        OUTPUT INSERTED.*
        WHERE RegistrationID = @RegistrationID
      `);

      return result.recordset[0];
    } catch (err) {
      console.error("Error updating registration:", err);
      throw err;
    }
  },

  delete: async (registrationId, transaction = null) => {
    try {
      let request;
      if (transaction) {
        request = transaction.request();
      } else {
        const pool = await sql.connect(dbConfig);
        request = pool.request();
      }

      const registration = await residenceRegistrationModel.getById(
        registrationId
      );

      await request
        .input("RegistrationID", sql.Int, registrationId)
        .query(
          "DELETE FROM ResidenceRegistrations WHERE RegistrationID = @RegistrationID"
        );

      return registration;
    } catch (err) {
      console.error("Error deleting registration:", err);
      throw err;
    }
  },

  findConflictingRegistrations: async (
    roomId,
    checkInDate,
    checkOutDate,
    excludeRegistrationId = null
  ) => {
    try {
      let pool = await sql.connect(dbConfig);
      let request = pool
        .request()
        .input("RoomID", sql.VarChar(20), roomId)
        .input("CheckInDate", sql.Date, checkInDate)
        .input("CheckOutDate", sql.Date, checkOutDate);

      let query = `
        SELECT r.*
        FROM ResidenceRegistrations r
        WHERE r.RoomID = @RoomID
          AND r.RegistrationStatus = 'Approved'
          AND (
            (@CheckInDate BETWEEN r.CheckInDate AND r.CheckOutDate)
            OR (@CheckOutDate BETWEEN r.CheckInDate AND r.CheckOutDate)
            OR (r.CheckInDate BETWEEN @CheckInDate AND @CheckOutDate)
          )
      `;

      if (excludeRegistrationId) {
        request.input("RegistrationID", sql.Int, excludeRegistrationId);
        query += " AND r.RegistrationID != @RegistrationID";
      }

      let result = await request.query(query);
      return result.recordset;
    } catch (err) {
      console.error("Error finding conflicting registrations:", err);
      throw err;
    }
  },

  checkRoomAvailability: async (roomId, checkInDate, checkOutDate) => {
    try {
      const conflictingRegistrations =
        await residenceRegistrationModel.findConflictingRegistrations(
          roomId,
          checkInDate,
          checkOutDate
        );
      return conflictingRegistrations.length === 0;
    } catch (err) {
      console.error("Error checking room availability:", err);
      throw err;
    }
  },
};

module.exports = residenceRegistrationModel;
