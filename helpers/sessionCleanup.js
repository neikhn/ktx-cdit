const sessionService = require('../services/sessionService');

const CLEANUP_INTERVAL = process.env.CLEANUP_INTERVAL_HOURS || 6;

const initializeSessionCleanup = () => {
    const intervalMs = CLEANUP_INTERVAL * 60 * 60 * 1000;
    
    setInterval(async () => {
        try {
            await sessionService.cleanupExpiredSessions();
        } catch (error) {
            console.error('Session cleanup failed:', error);
        }
    }, intervalMs);

    console.log(`Session cleanup scheduled to run every ${CLEANUP_INTERVAL} hours`);
};

module.exports = { initializeSessionCleanup };