const sessionService = require('../services/sessionService');

const authenticateSession = async (req, res, next) => {
    const sessionId = req.cookies.sessionId; // Session ID from cookie

    if (!sessionId) {
        return res.status(401).json({ message: "Authentication required: No session ID found." }); // No session cookie
    }

    try {
        const session = await sessionService.getSession(sessionId); // Validate session 

        if (!session) {
            return res.status(401).json({ message: "Authentication failed: Invalid session." }); 
        }
        // user verification
        if (req.user && req.user.UserID !== session.UserID) {
            return res.status(403).json({ 
                message: "Authentication failed: Session does not belong to this user." 
            });
        }

        req.session = session;
        // attach the verified userId for convenience in controllers
        // req.userId = session.UserID;
        next(); // Proceed 

    } catch (error) {
        console.error("Error during session authentication:", error);
        return res.status(500).json({ message: "Authentication error.", error: error.message });
    }
};

module.exports = authenticateSession;