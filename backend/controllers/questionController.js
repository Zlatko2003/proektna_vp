const Question = require('../models/Question');
const Answer = require('../models/Answer');

exports.getAllQuestions = async (req, res) => {
    try {
        const { page = 1, limit = 10, tag, search } = req.query;
        const query = {};
        
        if (tag) query.tags = tag;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }
        
        const questions = await Question.find(query)
            .populate('authorId', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        const total = await Question.countDocuments(query);
        
        res.json({
            questions,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('authorId', 'name email');
        
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        
        question.views += 1;
        await question.save();
        
        const answers = await Answer.find({ questionId: req.params.id })
            .populate('authorId', 'name email')
            .sort({ votes: -1, createdAt: 1 });
        
        res.json({ question, answers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createQuestion = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        
        const question = new Question({
            title,
            content,
            tags,
            authorId: req.user.id
        });
        
        await question.save();
        await question.populate('authorId', 'name email');
        
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        
        if (question.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }
        
        const { title, content, tags } = req.body;
        question.title = title || question.title;
        question.content = content || question.content;
        question.tags = tags || question.tags;
        question.updatedAt = Date.now();
        
        await question.save();
        
        res.json(question);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        
        if (question.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }
        
        await Answer.deleteMany({ questionId: req.params.id });
        await question.deleteOne();
        
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};