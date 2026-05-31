const router = require('express').Router();
const dbController = require('../controllers/dbController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.post('/seed', authMiddleware, adminMiddleware, dbController.seedDatabase);
router.delete('/clear', authMiddleware, adminMiddleware, dbController.clearDatabase);

module.exports = router;