const Comment = require('../models/Comment');

exports.getComments = async (req, res) => {
    try {
        const { parentType, parentId } = req.params;
        
        const comments = await Comment.find({ parentType, parentId })
            .populate('authorId', 'name email')
            .sort({ createdAt: 1 });
        
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createComment = async (req, res) => {
    try {
        const { content, parentType, parentId } = req.body;
        
        const comment = new Comment({
            content,
            authorId: req.user.id,
            parentType,
            parentId
        });
        
        await comment.save();
        await comment.populate('authorId', 'name email');
        
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        
        if (comment.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }
        
        await comment.deleteOne();
        
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};