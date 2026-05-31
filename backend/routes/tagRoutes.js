const router = require('express').Router();
const tagController = require('../controllers/tagController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         questionCount:
 *           type: integer
 *           default: 0
 */

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Get all tags sorted by question count
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: List of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Server error
 */
router.get('/', tagController.getAllTags);

/**
 * @swagger
 * /api/tags/popular:
 *   get:
 *     summary: Get top 10 most popular tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: List of popular tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Server error
 */
router.get('/popular', tagController.getPopularTags);

module.exports = router;