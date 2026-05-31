const router = require('express').Router();
const commentController = require('../controllers/commentController');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *         - authorId
 *         - parentType
 *         - parentId
 *       properties:
 *         _id:
 *           type: string
 *         content:
 *           type: string
 *         authorId:
 *           type: string
 *         parentType:
 *           type: string
 *           enum: [question, answer]
 *         parentId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/comments/{parentType}/{parentId}:
 *   get:
 *     summary: Get all comments for a question or answer
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: parentType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [question, answer]
 *         description: Type of parent (question or answer)
 *       - in: path
 *         name: parentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Parent ID
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Server error
 */
router.get('/:parentType/:parentId', commentController.getComments);

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - parentType
 *               - parentId
 *             properties:
 *               content:
 *                 type: string
 *               parentType:
 *                 type: string
 *                 enum: [question, answer]
 *               parentId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, commentController.createComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, commentController.deleteComment);

module.exports = router;