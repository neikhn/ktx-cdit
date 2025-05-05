const residenceRegistrationModel = require("../models/residenceRegistrationModel");
const roomModel = require("../models/roomModel");
const studentModel = require("../models/studentModel");

const validateRegistrationData = (registrationData, isNew = true) => {
  if (isNew) {
    if (!registrationData.StudentID) {
      throw new Error("Student ID is required");
    }
    if (!registrationData.RoomID) {
      throw new Error("Room ID is required");
    }
    if (!registrationData.CheckInDate) {
      throw new Error("Check-in date is required");
    }
    if (!registrationData.CheckOutDate) {
      throw new Error("Check-out date is required");
    }
  }

  if (registrationData.CheckInDate || registrationData.CheckOutDate) {
    const start = new Date(registrationData.CheckInDate);
    const end = new Date(registrationData.CheckOutDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format");
    }

    if (start >= end) {
      throw new Error("Check-in date must be before check-out date");
    }
  }
};

const residenceRegistrationService = {
  getAll: async () => {
    try {
      return await residenceRegistrationModel.getAll();
    } catch (err) {
      console.error("Error in residenceRegistrationService.getAll:", err);
      throw err;
    }
  },

  getById: async (registrationId) => {
    try {
      return await residenceRegistrationModel.getById(registrationId);
    } catch (err) {
      console.error("Error in residenceRegistrationService.getById:", err);
      throw err;
    }
  },

  create: async (registrationData) => {
    try {
      validateRegistrationData(registrationData, true);

      const student = await studentModel.getById(registrationData.StudentID);
      if (!student) {
        throw new Error("Student not found");
      }

      const room = await roomModel.getById(registrationData.RoomID);
      if (!room) {
        throw new Error("Room not found");
      }

      const isAvailable =
        await residenceRegistrationService.checkRoomAvailability(
          registrationData.RoomID,
          registrationData.CheckInDate,
          registrationData.CheckOutDate
        );

      if (!isAvailable) {
        throw new Error("Room is not available for the requested period");
      }

      return await residenceRegistrationModel.create(registrationData);
    } catch (err) {
      console.error("Error in residenceRegistrationService.create:", err);
      throw err;
    }
  },

  update: async (registrationId, registrationData) => {
    try {
      if (!registrationId) {
        throw new Error("Registration ID is required");
      }

      const existingRegistration = await residenceRegistrationModel.getById(
        registrationId
      );
      if (!existingRegistration) {
        throw new Error("Registration not found");
      }

      validateRegistrationData(registrationData, false);

      if (
        (registrationData.RoomID &&
          registrationData.RoomID !== existingRegistration.RoomID) ||
        (registrationData.CheckInDate &&
          registrationData.CheckInDate !== existingRegistration.CheckInDate) ||
        (registrationData.CheckOutDate &&
          registrationData.CheckOutDate !== existingRegistration.CheckOutDate)
      ) {
        const roomId = registrationData.RoomID || existingRegistration.RoomID;
        const checkInDate =
          registrationData.CheckInDate || existingRegistration.CheckInDate;
        const checkOutDate =
          registrationData.CheckOutDate || existingRegistration.CheckOutDate;

        const conflictingRegistrations =
          await residenceRegistrationModel.findConflictingRegistrationsExcluding(
            roomId,
            checkInDate,
            checkOutDate,
            registrationId
          );

        if (conflictingRegistrations.length > 0) {
          throw new Error("Room is not available for the requested period");
        }
      }

      return await residenceRegistrationModel.update(
        registrationId,
        registrationData
      );
    } catch (err) {
      console.error("Error in residenceRegistrationService.update:", err);
      throw err;
    }
  },

  delete: async (registrationId) => {
    try {
      if (!registrationId) {
        throw new Error("Registration ID is required");
      }

      const existingRegistration = await residenceRegistrationModel.getById(
        registrationId
      );
      if (!existingRegistration) {
        throw new Error("Registration not found");
      }

      const checkInDate = new Date(existingRegistration.CheckInDate);
      if (checkInDate <= new Date()) {
        throw new Error(
          "Cannot delete a registration that has already started"
        );
      }

      return await residenceRegistrationModel.delete(registrationId);
    } catch (err) {
      console.error("Error in residenceRegistrationService.delete:", err);
      throw err;
    }
  },

  getByStudentId: async (studentId) => {
    try {
      if (!studentId) {
        throw new Error("Student ID is required");
      }
      return await residenceRegistrationModel.getByStudentId(studentId);
    } catch (err) {
      console.error(
        "Error in residenceRegistrationService.getByStudentId:",
        err
      );
      throw err;
    }
  },

  getByRoomId: async (roomId) => {
    try {
      if (!roomId) {
        throw new Error("Room ID is required");
      }
      return await residenceRegistrationModel.getByRoomId(roomId);
    } catch (err) {
      console.error("Error in residenceRegistrationService.getByRoomId:", err);
      throw err;
    }
  },

  checkRoomAvailability: async (roomId, checkInDate, checkOutDate) => {
    try {
      if (!roomId || !checkInDate || !checkOutDate) {
        throw new Error(
          "Room ID, check-in date, and check-out date are required"
        );
      }

      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date format");
      }

      if (start >= end) {
        throw new Error("Check-in date must be before check-out date");
      }

      const room = await roomModel.getById(roomId);
      if (!room) {
        throw new Error("Room not found");
      }

        await residenceRegistrationModel.findConflictingRegistrations(
          roomId,
          checkInDate,
          checkOutDate
        );

      return conflictingRegistrations.length === 0;
    } catch (err) {
      console.error(
        "Error in residenceRegistrationService.checkRoomAvailability:",
        err
      );
      throw err;
    }
  },

  isRegistrationOwner: async (registrationId, userId) => {
    try {
      if (!registrationId || !userId) {
        return false;
      }

      const registration = await residenceRegistrationModel.getById(
        registrationId
      );
      if (!registration) {
        return false;
      }

      return await residenceRegistrationService.isStudentUser(
        registration.StudentID,
        userId
      );
    } catch (err) {
      console.error(
        "Error in residenceRegistrationService.isRegistrationOwner:",
        err
      );
      return false;
    }
  },

  isStudentUser: async (studentId, userId) => {
    try {
      if (!studentId || !userId) {
        return false;
      }

      const student = await studentModel.getById(studentId);
      if (!student) {
        return false;
      }

      return student.UserID === userId;
    } catch (err) {
      console.error(
        "Error in residenceRegistrationService.isStudentUser:",
        err
      );
      return false;
    }
  },
};

module.exports = residenceRegistrationService;
