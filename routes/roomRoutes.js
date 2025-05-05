const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const { authenticateSession } = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/roleMiddleware");
const { UserRoles } = require("../helpers/roleHelper");

router.use(authenticateSession);

router.get("/", roomController.getAll);

router.get("/:id", roomController.getById);

router.get("/:id/registrations", roomController.getRegistrations);

router.get("/by-area/:areaId", roomController.getByAreaId);

router.post("/", authorizeRole(UserRoles.MANAGER), roomController.create);

router.put("/:id", authorizeRole(UserRoles.MANAGER), roomController.update);

router.delete("/:id", authorizeRole(UserRoles.MANAGER), roomController.delete);

module.exports = router;
