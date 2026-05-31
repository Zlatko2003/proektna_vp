const Tag = require('../models/Tag');

exports.getAllTags = async (req, res) => {
    try {
        const tags = await Tag.find().sort({ questionCount: -1 });
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPopularTags = async (req, res) => {
    try {
        const tags = await Tag.find().sort({ questionCount: -1 }).limit(10);
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};