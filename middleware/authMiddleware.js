// middleware/authMiddleware.js
const sessionService = require('../services/sessionService');

const authenticateSession = async (req, res, next) => {
    const sessionId = req.cookies.sessionId; // Get session ID from cookie

    if (!sessionId) {
        return res.status(401).json({ message: "Authentication required: No session ID found." }); // No session cookie
    }

    try {
        const session = await sessionService.getSession(sessionId); // Validate session in database

        if (!session) {
            return res.status(401).json({ message: "Authentication failed: Invalid session." }); // Invalid session
        }

        // Session is valid, attach user info to request (you might want to fetch full user details here if needed)
        req.session = session; // Attach the session object to req.session
        // If you need full user details in your routes, you could modify getSession to return user info or fetch user here using session.MaNguoiDung

        next(); // Proceed to the next middleware or route handler

    } catch (error) {
        console.error("Error during session authentication:", error);
        return res.status(500).json({ message: "Authentication error.", error: error.message });
    }
};

module.exports = authenticateSession;