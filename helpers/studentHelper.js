const { UserRoles } = require("./roleHelper");

const studentHelper = {
  validationRules: {
    Gender: {
      validate: (value) => {
        const validGenders = ["Male", "Female"];
        return validGenders.includes(value);
      },
      errorMessage: "Invalid gender value. Must be either Male or Female",
    },
    StudentType: {
      validate: (value) => {
        const validStudentTypes = ["Domestic", "International"];
        return validStudentTypes.includes(value);
      },
      errorMessage:
        "Invalid student type. Must be either Domestic or International",
    },
    AcademicYear: {
      validate: (value) => {
        const academicYearRegex = /^\d{4}$/;
        return academicYearRegex.test(value);
      },
      errorMessage: "Invalid academic year format. Expected format: YYYY",
    },
  },

  validateStudentData: (studentData, requireAllFields = true) => {
    const requiredFields = [
      "StudentId",
      "DateOfBirth",
      "Gender",
      "StudentType",
      "AcademicYear",
    ];

    if (requireAllFields) {
      const missingFields = requiredFields.filter(
        (field) => !studentData[field]
      );
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }
    }

    Object.keys(studentData).forEach((field) => {
      const rule = studentHelper.validationRules[field];
      if (
        rule &&
        studentData[field] !== undefined &&
        studentData[field] !== null
      ) {
        if (!rule.validate(studentData[field])) {
          throw new Error(rule.errorMessage);
        }
      }
    });

    return true;
  },

  prepareStudentData: (userId, studentData) => {
    if (!userId || isNaN(parseInt(userId))) {
      throw new Error("Valid UserID is required to create a student record");
    }

    return {
      ...studentData,
      UserID: parseInt(userId, 10), 
    };
  },

  prepareUserData: (data) => {
    return {
      FullName: data.fullName,
      Email: data.email,
      Password: data.password,
      PhoneNumber: data.phoneNumber,
      ProfilePicture: data.profilePicture,
      UserType: UserRoles.STUDENT,
    };
  },
};

module.exports = studentHelper;
