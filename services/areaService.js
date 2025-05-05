const areaModel = require("../models/areaModel");
const roomModel = require("../models/roomModel");

const areaService = {
  getAll: async () => {
    try {
      return await areaModel.getAll();
    } catch (err) {
      console.error("Error in areaService.getAll:", err);
      throw err;
    }
  },

  getById: async (areaId) => {
    try {
      if (!areaId) {
        throw new Error("Area ID is required");
      }
      return await areaModel.getById(areaId);
    } catch (err) {
      console.error("Error in areaService.getById:", err);
      throw err;
    }
  },

  create: async (areaData) => {
    try {
      if (!areaData || !areaData.AreaName) {
        throw new Error("Area name is required");
      }
      return await areaModel.create(areaData);
    } catch (err) {
      console.error("Error in areaService.create:", err);
      throw err;
    }
  },

  update: async (areaId, areaData) => {
    try {
      if (!areaId) {
        throw new Error("Area ID is required");
      }
      if (!areaData || Object.keys(areaData).length === 0) {
        throw new Error("No update data provided");
      }
      return await areaModel.update(areaId, areaData);
    } catch (err) {
      console.error("Error in areaService.update:", err);
      throw err;
    }
  },

  delete: async (areaId) => {
    try {
      if (!areaId) {
        throw new Error("Area ID is required");
      }
      return await areaModel.delete(areaId);
    } catch (err) {
      console.error("Error in areaService.delete:", err);
      throw err;
    }
  },

  getRooms: async (areaId) => {
    try {
      if (!areaId) {
        throw new Error("Area ID is required");
      }
      return await roomModel.getByAreaId(areaId);
    } catch (err) {
      console.error("Error in areaService.getRooms:", err);
      throw err;
    }
  },
};

module.exports = areaService;
