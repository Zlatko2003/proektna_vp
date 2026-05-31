const axios = require('axios');

exports.searchRepos = async (req, res) => {
    try {
        const { tag } = req.query;
        
        if (!tag) {
            return res.status(400).json({ error: 'Tag parameter is required' });
        }
        
        const response = await axios.get(`https://api.github.com/search/repositories`, {
            params: {
                q: tag,
                sort: 'stars',
                per_page: 3
            }
        });
        
        const repos = response.data.items.map(repo => ({
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url
        }));
        
        res.json(repos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch GitHub repos' });
    }
};