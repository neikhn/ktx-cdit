const studentService = require("../services/studentService");

const studentController = {
  getAll: async (_, res) => {
    try {
      const students = await studentService.getAll();
      res.json(students);
    } catch (error) {
      console.error("Error getting all students:", error);
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const student = await studentService.getById(req.params.id);
      if (student) {
        res.json(student);
      } else {
        res.status(404).json({ message: "Student not found" });
      }
    } catch (error) {
      console.error("Error getting student:", error);
      res.status(500).json({ message: error.message });
    }
  },

  registerStudentAccount: async (req, res) => {
    try {
      const requiredFields = [
        'fullName', 'email', 'password', 'phoneNumber', 
        'studentId', 'dateOfBirth', 'gender', 'studentType', 'academicYear'
      ];
      
      const missingFields = requiredFields.filter(field => !req.body[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({
          message: "Missing required fields",
          fields: missingFields
        });
      }

      const userData = {
        FullName: req.body.fullName,
        Email: req.body.email,
        Password: req.body.password,
        PhoneNumber: req.body.phoneNumber,
        ProfilePicture: req.body.profilePicture || null,
        UserType: 4 // Student user type
      };

      const studentData = {
        StudentId: req.body.studentId,
        DateOfBirth: new Date(req.body.dateOfBirth),
        Gender: req.body.gender,
        StudentType: req.body.studentType,
        AcademicYear: req.body.academicYear
      };

      const result = await studentService.createStudentAccount(userData, studentData);
      
      res.status(201).json({
        message: 'Student account created successfully',
        data: result
      });
    } catch (error) {
      console.error('Error creating student account:', error);
      res.status(400).json({ 
        message: 'Failed to create student account',
        error: error.message 
      });
    }
  },

  create: async (req, res) => {
    try {
      const student = await studentService.create(req.body);
      res.status(201).json(student);
    } catch (error) {
      console.error("Error creating student:", error);
      res.status(400).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const updatedStudent = await studentService.update(req.params.id, req.body);
      if (updatedStudent) {
        res.json(updatedStudent);
      } else {
        res.status(404).json({ message: "Student not found" });
      }
    } catch (error) {
      console.error("Error updating student:", error);
      res.status(400).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await studentService.delete(req.params.id);
      res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = studentController; 