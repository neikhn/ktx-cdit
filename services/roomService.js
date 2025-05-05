const roomModel = require("../models/roomModel");
const areaModel = require("../models/areaModel");

const roomService = {
  getAll: async () => {
    try {
      return await roomModel.getAll();
    } catch (error) {
      throw new Error(`Error getting all rooms: ${error.message}`);
    }
  },

  getById: async (roomId) => {
    try {
      if (!roomId) {
        throw new Error("Room ID is required");
      }
      return await roomModel.getById(roomId);
    } catch (error) {
      throw new Error(`Error getting room by ID: ${error.message}`);
    }
  },

  create: async (roomData) => {
    try {
      // Validation
      if (!roomData.MaxCapacity) {
        throw new Error("Room ID is required");
      }
      if (!roomData.RoomName) {
        throw new Error("Room name is required");
      }
      if (!roomData.AreaID) {
        throw new Error("Area ID is required");
      }
      if (!roomData.MaxCapacity) {
        throw new Error("Max capacity is required");
      }
      if (roomData.RoomID <= 0) {
        throw new Error("Max capacity must be a positive number");
      }

      const area = await areaModel.getById(roomData.AreaID);
      if (!area) {
        throw new Error("Selected area does not exist");
      }

      const existingRoom = await roomModel.getByAreaId(roomData.AreaID);
      if (existingRoom.some((room) => room.RoomName === roomData.RoomName)) {
        throw new Error("Room with this name already exists in the area");
      }

      return await roomModel.create(roomData);
    } catch (error) {
      throw new Error(`Error creating room: ${error.message}`);
    }
  },

  update: async (roomId, roomData) => {
    try {
      if (!roomId) {
        throw new Error("Room ID is required");
      }
      if (!roomData || Object.keys(roomData).length === 0) {
        throw new Error("Update data is required");
      }

      const existingRoom = await roomModel.getById(roomId);
      if (!existingRoom) {
        throw new Error("Room not found");
      }

      if (roomData.AreaID && roomData.AreaID !== existingRoom.AreaID) {
        const area = await areaModel.getById(roomData.AreaID);
        if (!area) {
          throw new Error("Selected area does not exist");
        }
      }

      if (roomData.MaxCapacity && roomData.MaxCapacity <= 0) {
        throw new Error("Max capacity must be a positive number");
      }

      return await roomModel.update(roomId, roomData);
    } catch (error) {
      throw new Error(`Error updating room: ${error.message}`);
    }
  },

  delete: async (roomId) => {
    try {
      if (!roomId) {
        throw new Error("Room ID is required");
      }

      const room = await roomModel.getById(roomId);
      if (!room) {
        throw new Error("Room not found");
      }

      const registrations = await roomModel.getRegistrations(roomId);
      if (registrations && registrations.length > 0) {
        throw new Error("Cannot delete room with associated registrations");
      }

      return await roomModel.delete(roomId);
    } catch (error) {
      throw new Error(`Error deleting room: ${error.message}`);
    }
  },

  getByAreaId: async (areaId) => {
    try {
      if (!areaId) {
        throw new Error("Area ID is required");
      }

      const area = await areaModel.getById(areaId);
      if (!area) {
        throw new Error("Area not found");
      }

      return await roomModel.getByAreaId(areaId);
    } catch (error) {
      throw new Error(`Error getting rooms by area ID: ${error.message}`);
    }
  },

  getRegistrations: async (roomId) => {
    try {
      if (!roomId) {
        throw new Error("Room ID is required");
      }

      const room = await roomModel.getById(roomId);
      if (!room) {
        throw new Error("Room not found");
      }

      return await roomModel.getRegistrations(roomId);
    } catch (error) {
      throw new Error(`Error getting registrations for room: ${error.message}`);
    }
  },
};

module.exports = roomService;
