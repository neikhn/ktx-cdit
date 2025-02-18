const express = require('express');
const sessionController = require('../controllers/sessionController');
const authenticateSession = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', sessionController.login);

router.get('/info', authenticateSession, sessionController.getSessionInfo); 

router.delete('/logout', authenticateSession, sessionController.logout);

module.exports = router;