const areaService = require("../services/areaService");

const areaController = {
  getAll: async (req, res) => {
    try {
      const areas = await areaService.getAll();
      res.status(200).json({
        message: "Areas retrieved successfully",
        data: areas,
      });
    } catch (error) {
      console.error("Error retrieving areas:", error);
      res.status(500).json({
        message: "Failed to retrieve areas",
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const area = await areaService.getById(id);

      if (!area) {
        return res.status(404).json({
          message: "Area not found",
        });
      }

      res.status(200).json({
        message: "Area retrieved successfully",
        data: area,
      });
    } catch (error) {
      console.error("Error retrieving area:", error);
      res.status(500).json({
        message: "Failed to retrieve area",
        error: error.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const areaData = req.body;

      if (!areaData.AreaName) {
        return res.status(400).json({
          message: "Area name is required",
        });
      }

      const newArea = await areaService.create(areaData);
      res.status(201).json({
        message: "Area created successfully",
        data: newArea,
      });
    } catch (error) {
      console.error("Error creating area:", error);
      res.status(500).json({
        message: "Failed to create area",
        error: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const areaData = req.body;

      if (Object.keys(areaData).length === 0) {
        return res.status(400).json({
          message: "No update data provided",
        });
      }

      const area = await areaService.getById(id);
      if (!area) {
        return res.status(404).json({
          message: "Area not found",
        });
      }

      const updatedArea = await areaService.update(id, areaData);
      res.status(200).json({
        message: "Area updated successfully",
        data: updatedArea,
      });
    } catch (error) {
      console.error("Error updating area:", error);
      res.status(500).json({
        message: "Failed to update area",
        error: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      const area = await areaService.getById(id);
      if (!area) {
        return res.status(404).json({
          message: "Area not found",
        });
      }

      try {
        const deletedArea = await areaService.delete(id);
        res.status(200).json({
          message: "Area deleted successfully",
          data: deletedArea,
        });
      } catch (error) {
        if (error.message.includes("associated rooms")) {
          return res.status(400).json({
            message:
              "Cannot delete area with associated rooms. Remove all rooms first.",
          });
        }
        throw error;
      }
    } catch (error) {
      console.error("Error deleting area:", error);
      res.status(500).json({
        message: "Failed to delete area",
        error: error.message,
      });
    }
  },

  getRooms: async (req, res) => {
    try {
      const { id } = req.params;

      const area = await areaService.getById(id);
      if (!area) {
        return res.status(404).json({
          message: "Area not found",
        });
      }

      const rooms = await areaService.getRooms(id);
      res.status(200).json({
        message: "Rooms retrieved successfully",
        data: rooms,
      });
    } catch (error) {
      console.error("Error retrieving rooms for area:", error);
      res.status(500).json({
        message: "Failed to retrieve rooms",
        error: error.message,
      });
    }
  },
};

module.exports = areaController;
