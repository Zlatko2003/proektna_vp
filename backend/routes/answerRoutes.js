const router = require('express').Router();
const answerController = require('../controllers/answerController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/question/:questionId', authMiddleware, answerController.createAnswer);
router.put('/:id', authMiddleware, answerController.updateAnswer);
router.delete('/:id', authMiddleware, answerController.deleteAnswer);
router.patch('/:id/vote', authMiddleware, answerController.voteAnswer);
router.patch('/:id/accept', authMiddleware, answerController.acceptAnswer);

module.exports = router;