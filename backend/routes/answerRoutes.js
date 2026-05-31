const router = require('express').Router();
const answerController = require('../controllers/answerController');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Answer:
 *       type: object
 *       required:
 *         - content
 *         - authorId
 *         - questionId
 *       properties:
 *         _id:
 *           type: string
 *         content:
 *           type: string
 *         authorId:
 *           type: string
 *         questionId:
 *           type: string
 *         isAccepted:
 *           type: boolean
 *           default: false
 *         votes:
 *           type: integer
 *           default: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/answers/question/{questionId}:
 *   post:
 *     summary: Post an answer to a question
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Here is my answer to the question...
 *     responses:
 *       201:
 *         description: Answer posted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Answer'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.post('/question/:questionId', authMiddleware, answerController.createAnswer);

/**
 * @swagger
 * /api/answers/{id}:
 *   put:
 *     summary: Update an answer
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Answer ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Answer updated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Answer not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, answerController.updateAnswer);

/**
 * @swagger
 * /api/answers/{id}:
 *   delete:
 *     summary: Delete an answer
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Answer ID
 *     responses:
 *       200:
 *         description: Answer deleted
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Answer not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, answerController.deleteAnswer);

/**
 * @swagger
 * /api/answers/{id}/vote:
 *   patch:
 *     summary: Vote on an answer (upvote/downvote)
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Answer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vote
 *             properties:
 *               vote:
 *                 type: string
 *                 enum: [up, down]
 *     responses:
 *       200:
 *         description: Vote recorded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 votes:
 *                   type: integer
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Answer not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/vote', authMiddleware, answerController.voteAnswer);

/**
 * @swagger
 * /api/answers/{id}/accept:
 *   patch:
 *     summary: Accept an answer as correct (only question author or admin)
 *     tags: [Answers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Answer ID
 *     responses:
 *       200:
 *         description: Answer accepted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAccepted:
 *                   type: boolean
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Answer not found
 *       500:
 *         description: Server error
 */
router.patch('/:id/accept', authMiddleware, answerController.acceptAnswer);

module.exports = router;