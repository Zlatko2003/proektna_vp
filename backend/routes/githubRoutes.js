const router = require('express').Router();
const githubController = require('../controllers/githubController');

/**
 * @swagger
 * /api/github/search:
 *   get:
 *     summary: Search GitHub repositories by tag
 *     tags: [GitHub]
 *     description: External API integration - returns top 3 repositories related to a tag
 *     parameters:
 *       - in: query
 *         name: tag
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag to search for (e.g., react, nodejs)
 *     responses:
 *       200:
 *         description: List of GitHub repositories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   fullName:
 *                     type: string
 *                   description:
 *                     type: string
 *                   stars:
 *                     type: integer
 *                   forks:
 *                     type: integer
 *                   url:
 *                     type: string
 *       400:
 *         description: Tag parameter is required
 *       500:
 *         description: Failed to fetch from GitHub API
 */
router.get('/search', githubController.searchRepos);

module.exports = router;