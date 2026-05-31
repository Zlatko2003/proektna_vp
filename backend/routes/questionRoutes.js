const router = require('express').Router();
const questionController = require('../controllers/questionController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestionById);
router.post('/', authMiddleware, questionController.createQuestion);
router.put('/:id', authMiddleware, questionController.updateQuestion);
router.delete('/:id', authMiddleware, questionController.deleteQuestion);

module.exports = router;