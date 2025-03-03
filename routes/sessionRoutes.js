const express = require("express");
const sessionController = require("../controllers/sessionController");
const { authenticateSession } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/logout", authenticateSession, sessionController.logout);
router.get("/check", authenticateSession, sessionController.check);

module.exports = router;
