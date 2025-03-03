const express = require("express");
const userController = require("../controllers/userController");
const { authenticateSession } = require("../middlewares/authMiddleware");
const {
  authorizeRole,
  authorizeUserModification,
} = require("../middlewares/roleMiddleware");
const { UserRoles } = require("../helpers/roleHelper");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get(
  "/",
  authenticateSession,
  authorizeRole(UserRoles.MANAGER),
  userController.getAll
);
router.get(
  "/:id",
  authenticateSession,
  authorizeUserModification,
  userController.getById
);
router.put(
  "/:id",
  authenticateSession,
  authorizeUserModification,
  userController.update
);
router.delete(
  "/:id",
  authenticateSession,
  authorizeRole(UserRoles.ADMINISTRATOR),
  authorizeUserModification,
  userController.delete
);

module.exports = router;
