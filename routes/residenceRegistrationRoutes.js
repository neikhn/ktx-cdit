const express = require("express");
const router = express.Router();
const residenceRegistrationController = require("../controllers/residenceRegistrationController");
const { authenticateSession } = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/roleMiddleware");
const { UserRoles } = require("../helpers/roleHelper");

router.use(authenticateSession);

router.get(
  "/",
  authorizeRole(UserRoles.MANAGER),
  residenceRegistrationController.getAll
);

router.get(
  "/by-student/:studentId",
  residenceRegistrationController.getByStudentId
);

router.get(
  "/by-room/:roomId",
  authorizeRole(UserRoles.MANAGER),
  residenceRegistrationController.getByRoomId
);

router.get(
  "/check-room-availability/:roomId",
  residenceRegistrationController.checkRoomAvailability
);

router.get("/:id", residenceRegistrationController.getById);

router.post(
  "/",
  authorizeRole(UserRoles.MANAGER),
  residenceRegistrationController.create
);

router.put(
  "/:id",
  authorizeRole(UserRoles.MANAGER),
  residenceRegistrationController.update
);

router.delete(
  "/:id",
  authorizeRole(UserRoles.MANAGER),
  residenceRegistrationController.delete
);

module.exports = router;
