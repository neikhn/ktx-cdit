const sql = require("mssql");
const dbConfig = require("../dbConfig");

const roomModel = {
  getAll: async () => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request().query(`
        SELECT *
        FROM Rooms
        ORDER BY RoomID
      `);
      return result.recordset;
    } catch (err) {
      console.error("Error getting all rooms:", err);
      throw err;
    }
  },

  getById: async (roomId) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request().input("RoomID", sql.VarChar(20), roomId)
        .query(`
        SELECT r.*, a.AreaName 
        FROM Rooms r
        JOIN Areas a ON r.AreaID = a.AreaID
        WHERE r.RoomID = @RoomID
      `);
      return result.recordset[0];
    } catch (err) {
      console.error("Error getting room by ID:", err);
      throw err;
    }
  },

  getByAreaId: async (areaId) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request().input("AreaID", sql.Int, areaId).query(`
        SELECT r.*, a.AreaName 
        FROM Rooms r
        JOIN Areas a ON r.AreaID = a.AreaID
        WHERE r.AreaID = @AreaID
          ORDER BY r.RoomID
      `);
      return result.recordset;
    } catch (err) {
      console.error("Error getting rooms by area ID:", err);
      throw err;
    }
  },

  create: async (roomData, transaction = null) => {
    try {
      let request;
      if (transaction) {
        request = transaction.request();
      } else {
        const pool = await sql.connect(dbConfig);
        request = pool.request();
      }

      let result = await request
        .input("RoomID", sql.VarChar(20), roomData.RoomID)
        .input("RoomName", sql.NVarChar(100), roomData.RoomName)
        .input("MaxCapacity", sql.Int, roomData.MaxCapacity)
        .input("AreaID", sql.Int, roomData.AreaID).query(`
          INSERT INTO Rooms (RoomID, RoomName, MaxCapacity, AreaID)
        OUTPUT INSERTED.*
          VALUES (@RoomID, @RoomName, @MaxCapacity, @AreaID)
      `);
      return result.recordset[0];
    } catch (err) {
      console.error("Error creating room:", err);
      throw err;
    }
  },

  update: async (roomId, roomData, transaction = null) => {
    try {
      let request;
      if (transaction) {
        request = transaction.request();
      } else {
        const pool = await sql.connect(dbConfig);
        request = pool.request();
      }

      // Build dynamic update SQL query
      let updateFields = [];
      if (roomData.RoomName !== undefined) {
        request.input("RoomName", sql.NVarChar(100), roomData.RoomName);
        updateFields.push("RoomName = @RoomName");
      }

      if (roomData.MaxCapacity !== undefined) {
        request.input("MaxCapacity", sql.Int, roomData.MaxCapacity);
        updateFields.push("MaxCapacity = @MaxCapacity");
      }

      if (roomData.AreaID !== undefined) {
        request.input("AreaID", sql.Int, roomData.AreaID);
        updateFields.push("AreaID = @AreaID");
      }

      if (updateFields.length === 0) {
        throw new Error("No fields to update");
      }

      request.input("RoomID", sql.VarChar(20), roomId);

      const result = await request.query(`
      UPDATE Rooms
      SET ${updateFields.join(", ")}
      OUTPUT INSERTED.*
      WHERE RoomID = @RoomID
    `);

      return result.recordset[0];
    } catch (err) {
      console.error("Error updating room:", err);
      throw err;
    }
  },

  delete: async (roomId, transaction = null) => {
    try {
      let request;
      if (transaction) {
        request = transaction.request();
      } else {
        const pool = await sql.connect(dbConfig);
        request = pool.request();
      }

      // Get room before deletion for return value
      const room = await roomModel.getById(roomId);

      await request
        .input("RoomID", sql.VarChar(20), roomId)
        .query("DELETE FROM Rooms WHERE RoomID = @RoomID");

      return room;
    } catch (err) {
      console.error("Error deleting room:", err);
      throw err;
    }
  },

  getRegistrations: async (roomId) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request().input("RoomID", sql.VarChar(20), roomId)
        .query(`
          SELECT r.*
          FROM ResidenceRegistrations r
          WHERE r.RoomID = @RoomID
          ORDER BY r.RegistrationDate DESC
        `);
      return result.recordset;
    } catch (err) {
      console.error("Error getting room registrations:", err);
      throw err;
    }
  },

  hasResidents: async (roomId) => {
    const connection = await sql.connect(dbConfig);
    try {
      const result = await connection
        .request()
        .input("RoomID", sql.VarChar(20), roomId).query(`
        SELECT COUNT(*) AS count 
        FROM ResidenceRegistrations 
        WHERE RoomID = @RoomID AND Status IN (1, 2) /* Pending or Approved */
      `);
      return result.recordset[0].count > 0;
    } catch (error) {
      throw new Error(`Error checking room residents: ${error.message}`);
    }
  },

  getAvailableRooms: async () => {
    const connection = await sql.connect(dbConfig);
    try {
      const result = await connection.request().query(`
        SELECT r.*, a.AreaName,
            (r.MaxCapacity - (
            SELECT COUNT(*) 
            FROM ResidenceRegistrations rr 
            WHERE rr.RoomID = r.RoomID AND rr.Status = 2 /* Approved */
          )) AS AvailableSpots
        FROM Rooms r
        JOIN Areas a ON r.AreaID = a.AreaID
          WHERE (r.MaxCapacity - (
          SELECT COUNT(*) 
          FROM ResidenceRegistrations rr 
          WHERE rr.RoomID = r.RoomID AND rr.Status = 2 /* Approved */
        )) > 0
        ORDER BY a.AreaName, r.RoomName
      `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Error getting available rooms: ${error.message}`);
    }
  },
};

module.exports = roomModel;
