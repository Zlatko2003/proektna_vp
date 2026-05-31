const router = require('express').Router();
const githubController = require('../controllers/githubController');

router.get('/search', githubController.searchRepos);

module.exports = router;