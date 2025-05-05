const roomService = require("../services/roomService");

const roomController = {
  getAll: async (req, res) => {
    try {
      const rooms = await roomService.getAll();
      res.status(200).json({
        message: "Rooms retrieved successfully",
        data: rooms,
      });
    } catch (error) {
      console.error("Error retrieving rooms:", error);
      res.status(500).json({
        message: "Failed to retrieve rooms",
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const room = await roomService.getById(id);

      if (!room) {
        return res.status(404).json({
          message: "Room not found",
        });
      }

      res.status(200).json({
        message: "Room retrieved successfully",
        data: room,
      });
    } catch (error) {
      console.error("Error retrieving room:", error);
      res.status(500).json({
        message: "Failed to retrieve room",
        error: error.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const roomData = req.body;

      if (
        !roomData.RoomID ||
        !roomData.RoomName ||
        !roomData.AreaID ||
        !roomData.MaxCapacity
      ) {
        return res.status(400).json({
          message: "Room ID, room name, area ID, and max capacity are required",
        });
      }

      const newRoom = await roomService.create(roomData);
      res.status(201).json({
        message: "Room created successfully",
        data: newRoom,
      });
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({
        message: "Failed to create room",
        error: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const roomData = req.body;

      if (Object.keys(roomData).length === 0) {
        return res.status(400).json({
          message: "No update data provided",
        });
      }

      const room = await roomService.getById(id);
      if (!room) {
        return res.status(404).json({
          message: "Room not found",
        });
      }

      const updatedRoom = await roomService.update(id, roomData);
      res.status(200).json({
        message: "Room updated successfully",
        data: updatedRoom,
      });
    } catch (error) {
      console.error("Error updating room:", error);
      res.status(500).json({
        message: "Failed to update room",
        error: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const room = await roomService.getById(id);
      if (!room) {
        return res.status(404).json({
          message: "Room not found",
        });
      }

      try {
        const deletedRoom = await roomService.delete(id);
        res.status(200).json({
          message: "Room deleted successfully",
          data: deletedRoom,
        });
      } catch (error) {
        if (error.message.includes("has residents")) {
          return res.status(400).json({
            message:
              "Cannot delete room with residents. Remove all residents first.",
          });
        }
        throw error;
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      res.status(500).json({
        message: "Failed to delete room",
        error: error.message,
      });
    }
  },

  getByAreaId: async (req, res) => {
    try {
      const { areaId } = req.params;
      const rooms = await roomService.getByAreaId(areaId);
      res.status(200).json({
        message: "Rooms retrieved successfully",
        data: rooms,
      });
    } catch (error) {
      console.error("Error retrieving rooms by area:", error);
      res.status(500).json({
        message: "Failed to retrieve rooms",
        error: error.message,
      });
    }
  },

  getRegistrations: async (req, res) => {
    try {
      const { id } = req.params;
      const registrations = await roomService.getRegistrations(id);
      res.status(200).json({
        message: "Registrations retrieved successfully",
        data: registrations,
      });
    } catch (error) {
      console.error("Error retrieving registrations for room:", error);
      res.status(500).json({
        message: "Failed to retrieve registrations",
        error: error.message,
      });
    }
  },
};

module.exports = roomController;
