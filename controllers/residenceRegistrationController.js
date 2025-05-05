const residenceRegistrationService = require("../services/residenceRegistrationService");

const residenceRegistrationController = {
  getAll: async (req, res) => {
    try {
      const registrations = await residenceRegistrationService.getAll();
      res.status(200).json({
        message: "Registrations retrieved successfully",
        data: registrations,
      });
    } catch (err) {
      console.error("Error in residenceRegistrationController.getAll:", err);
      res.status(500).json({
        message: "Failed to retrieve registrations",
        error: err.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const id = req.params.id;
      const registration = await residenceRegistrationService.getById(id);

      if (!registration) {
        return res.status(404).json({
          message: "Registration not found",
        });
      }

      res.status(200).json({
        message: "Registration retrieved successfully",
        data: registration,
      });
    } catch (err) {
      console.error("Error in residenceRegistrationController.getById:", err);
      res.status(500).json({
        message: "Failed to retrieve registration",
        error: err.message,
      });
    }
  },

  getByStudentId: async (req, res) => {
    try {
      const { studentId } = req.params;
      const registrations = await residenceRegistrationService.getByStudentId(
        studentId
      );

      res.status(200).json({
        message: "Registrations retrieved successfully",
        data: registrations,
      });
    } catch (err) {
      console.error(
        "Error in residenceRegistrationController.getByStudentId:",
        err
      );
      res.status(500).json({
        message: "Failed to retrieve registrations",
        error: err.message,
      });
    }
  },

  getByRoomId: async (req, res) => {
    try {
      const { roomId } = req.params;
      const registrations = await residenceRegistrationService.getByRoomId(
        roomId
      );

      res.status(200).json({
        message: "Registrations retrieved successfully",
        data: registrations,
      });
    } catch (err) {
      console.error(
        "Error in residenceRegistrationController.getByRoomId:",
        err
      );
      res.status(500).json({
        message: "Failed to retrieve registrations",
        error: err.message,
      });
    }
  },

  checkRoomAvailability: async (req, res) => {
    try {
      const { roomId } = req.params;
      const { checkInDate, checkOutDate } = req.query;

      if (!checkInDate || !checkOutDate) {
        return res.status(400).json({
          message: "Check-in date and check-out date are required",
        });
      }

      const isAvailable =
        await residenceRegistrationService.checkRoomAvailability(
          roomId,
          checkInDate,
          checkOutDate
        );
      res.status(200).json({
        message: "Room availability checked successfully",
        data: { isAvailable },
      });
    } catch (err) {
      console.error(
        "Error in residenceRegistrationController.checkRoomAvailability:",
        err
      );
      res.status(500).json({
        message: "Failed to check room availability",
        error: err.message,
      });
    }
  },

  create: async (req, res) => {
    try {
      const registrationData = req.body;

      if (
        !registrationData.StudentID ||
        !registrationData.RoomID ||
        !registrationData.CheckInDate ||
        !registrationData.CheckOutDate
      ) {
        return res.status(400).json({
          message:
            "Student ID, room ID, check-in date, and check-out date are required",
        });
      }

      const newRegistration = await residenceRegistrationService.create(
        registrationData
      );
      res.status(201).json({
        message: "Registration created successfully",
        data: newRegistration,
      });
    } catch (err) {
      console.error("Error in residenceRegistrationController.create:", err);
      res.status(500).json({
        message: "Failed to create registration",
        error: err.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const registrationData = req.body;

      console.log("Update request - ID:", id);
      console.log("Update request - Data:", registrationData);

      if (Object.keys(registrationData).length === 0) {
        return res.status(400).json({
          message: "No update data provided",
        });
      }

      // Normalize the status field name
      if (registrationData.RegistrationStatus) {
        registrationData.registrationStatus =
          registrationData.RegistrationStatus;
        delete registrationData.RegistrationStatus;
      }

      console.log("Normalized data:", registrationData);

      const registration = await residenceRegistrationService.getById(id);
      console.log("Found registration:", registration);

      if (!registration) {
        return res.status(404).json({
          message: "Registration not found",
        });
      }

      const updatedRegistration = await residenceRegistrationService.update(
        id,
        registrationData
      );
      res.status(200).json({
        message: "Registration updated successfully",
        data: updatedRegistration,
      });
    } catch (err) {
      console.error("Error in residenceRegistrationController.update:", err);
      res.status(500).json({
        message: "Failed to update registration",
        error: err.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { registrationId } = req.params;

      const registration = await residenceRegistrationService.getById(
        registrationId
      );
      if (!registration) {
        return res.status(404).json({
          message: "Registration not found",
        });
      }

      const deletedRegistration = await residenceRegistrationService.delete(
        registrationId
      );
      res.status(200).json({
        message: "Registration deleted successfully",
        data: deletedRegistration,
      });
    } catch (err) {
      console.error("Error in residenceRegistrationController.delete:", err);
      res.status(500).json({
        message: "Failed to delete registration",
        error: err.message,
      });
    }
  },
};

module.exports = residenceRegistrationController;
