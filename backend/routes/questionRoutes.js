const router = require('express').Router();
const questionController = require('../controllers/questionController');
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - authorId
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *           minLength: 10
 *           maxLength: 200
 *         content:
 *           type: string
 *           minLength: 20
 *           maxLength: 5000
 *         authorId:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         views:
 *           type: integer
 *           default: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Get all questions with pagination
 *     tags: [Questions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or content
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by tag
 *     responses:
 *       200:
 *         description: List of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Question'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.get('/', questionController.getAllQuestions);

/**
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     summary: Get single question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Question details with answers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question:
 *                   $ref: '#/components/schemas/Question'
 *                 answers:
 *                   type: array
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.get('/:id', questionController.getQuestionById);

/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Create a new question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: How to use useState in React?
 *               content:
 *                 type: string
 *                 example: I am learning React and I want to understand how useState hook works...
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["react", "hooks"]
 *     responses:
 *       201:
 *         description: Question created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, questionController.createQuestion);

/**
 * @swagger
 * /api/questions/{id}:
 *   put:
 *     summary: Update a question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Question updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Question'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, questionController.updateQuestion);

/**
 * @swagger
 * /api/questions/{id}:
 *   delete:
 *     summary: Delete a question
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Question deleted
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, questionController.deleteQuestion);

module.exports = router;