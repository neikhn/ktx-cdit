const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { authenticateSession } = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/roleMiddleware");
const { UserRoles } = require("../helpers/roleHelper");

// Student account registration (creates both user and student records)
router.post(
  "/register",
  authenticateSession,
  authorizeRole(UserRoles.MANAGER),
  studentController.registerStudentAccount
);

router.get(
  "/",
  authenticateSession,
  authorizeRole(UserRoles.MANAGER),
  studentController.getAll
);

router.get("/:id", authenticateSession, studentController.getById);

router.put("/:id", authenticateSession, studentController.update);

router.delete(
  "/:id",
  authenticateSession,
  authorizeRole(UserRoles.ADMINISTRATOR),
  studentController.delete
);

module.exports = router;
