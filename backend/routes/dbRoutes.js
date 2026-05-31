const router = require('express').Router();
const dbController = require('../controllers/dbController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /db/seed:
 *   post:
 *     summary: Seed database with sample data
 *     tags: [Database]
 *     security:
 *       - bearerAuth: []
 *     description: Admin only - Populates database with initial users, questions, answers and tags
 *     responses:
 *       200:
 *         description: Database seeded successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */
router.post('/seed', authMiddleware, adminMiddleware, dbController.seedDatabase);

/**
 * @swagger
 * /db/clear:
 *   delete:
 *     summary: Clear all data from database
 *     tags: [Database]
 *     security:
 *       - bearerAuth: []
 *     description: Admin only - Deletes all documents from all collections
 *     responses:
 *       200:
 *         description: Database cleared successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */
router.delete('/clear', authMiddleware, adminMiddleware, dbController.clearDatabase);

module.exports = router;