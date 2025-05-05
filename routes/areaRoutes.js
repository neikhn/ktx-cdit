const express = require("express");
const router = express.Router();
const areaController = require("../controllers/areaController");
const { authenticateSession } = require("../middlewares/authMiddleware");
const { authorizeRole } = require("../middlewares/roleMiddleware");
const { UserRoles } = require("../helpers/roleHelper");

router.use(authenticateSession);

router.get("/", areaController.getAll);

router.get("/:id", areaController.getById);

router.get("/:id/rooms", areaController.getRooms);

router.post("/", authorizeRole(UserRoles.MANAGER), areaController.create);

router.put("/:id", authorizeRole(UserRoles.MANAGER), areaController.update);

router.delete("/:id", authorizeRole(UserRoles.MANAGER), areaController.delete);

module.exports = router;
