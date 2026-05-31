const router = require('express').Router();
const tagController = require('../controllers/tagController');

router.get('/', tagController.getAllTags);
router.get('/popular', tagController.getPopularTags);

module.exports = router;