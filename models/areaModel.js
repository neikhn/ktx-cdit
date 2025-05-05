const sql = require("mssql");
const dbConfig = require("../dbConfig");

const areaModel = {
  getAll: async () => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request().query(`
        SELECT *
        FROM Areas
        ORDER BY AreaID
      `);
      return result.recordset;
    } catch (err) {
      console.error("Error getting all areas:", err);
      throw err;
    }
  },

  getById: async (areaId) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool.request().input("AreaID", sql.Int, areaId).query(`
          SELECT *
          FROM Areas
          WHERE AreaID = @AreaID
        `);
      return result.recordset[0];
    } catch (err) {
      console.error("Error getting area by ID:", err);
      throw err;
    }
  },

  create: async (areaData) => {
    try {
      let pool = await sql.connect(dbConfig);
      let result = await pool
        .request()
        .input("AreaName", sql.NVarChar(100), areaData.AreaName)
        .input(
          "AreaDescription",
          sql.NVarChar(sql.MAX),
          areaData.AreaDescription || null
        ).query(`
          INSERT INTO Areas (AreaName, AreaDescription)
          OUTPUT INSERTED.*
          VALUES (@AreaName, @AreaDescription)
        `);
      return result.recordset[0];
    } catch (err) {
      console.error("Error creating area:", err);
      throw err;
    }
  },

  update: async (areaId, areaData) => {
    try {
      const pool = await sql.connect(dbConfig);
      const request = pool.request();

      // Build dynamic update SQL query
      let updateFields = [];
      if (areaData.AreaName !== undefined) {
        request.input("AreaName", sql.NVarChar(100), areaData.AreaName);
        updateFields.push("AreaName = @AreaName");
      }

      if (areaData.AreaDescription !== undefined) {
        request.input(
          "AreaDescription",
          sql.NVarChar(sql.MAX),
          areaData.AreaDescription
        );
        updateFields.push("AreaDescription = @AreaDescription");
      }

      if (updateFields.length === 0) {
        throw new Error("No fields to update");
      }

      request.input("AreaID", sql.Int, areaId);

      const result = await request.query(`
        UPDATE Areas
        SET ${updateFields.join(", ")}
        OUTPUT INSERTED.*
        WHERE AreaID = @AreaID
      `);

      return result.recordset[0];
    } catch (err) {
      console.error("Error updating area:", err);
      throw err;
    }
  },

  delete: async (areaId, transaction = null) => {
    try {
      let request;
      if (transaction) {
        request = transaction.request();
      } else {
        const pool = await sql.connect(dbConfig);
        request = pool.request();
      }

      // Get area before deletion for return value
      const area = await areaModel.getById(areaId);

      await request
        .input("AreaID", sql.Int, areaId)
        .query("DELETE FROM Areas WHERE AreaID = @AreaID");

      return area;
    } catch (err) {
      console.error("Error deleting area:", err);
      throw err;
    }
  },
};

module.exports = areaModel;
