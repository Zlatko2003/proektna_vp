const Answer = require('../models/Answer');
const Question = require('../models/Question');

exports.createAnswer = async (req, res) => {
    try {
        const { content } = req.body;
        const questionId = req.params.questionId;
        
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        
        const answer = new Answer({
            content,
            authorId: req.user.id,
            questionId
        });
        
        await answer.save();
        await answer.populate('authorId', 'name email');
        
        res.status(201).json(answer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAnswer = async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        
        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }
        
        if (answer.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }
        
        answer.content = req.body.content || answer.content;
        await answer.save();
        
        res.json(answer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAnswer = async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        
        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }
        
        if (answer.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }
        
        await answer.deleteOne();
        
        res.json({ message: 'Answer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.voteAnswer = async (req, res) => {
    try {
        const { vote } = req.body;
        const answer = await Answer.findById(req.params.id);
        
        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }
        
        if (vote === 'up') {
            answer.votes += 1;
        } else if (vote === 'down') {
            answer.votes -= 1;
        }
        
        await answer.save();
        
        res.json({ votes: answer.votes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.acceptAnswer = async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);
        
        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }
        
        const question = await Question.findById(answer.questionId);
        
        if (question.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Only question author can accept answers' });
        }
        
        await Answer.updateMany(
            { questionId: answer.questionId },
            { isAccepted: false }
        );
        
        answer.isAccepted = true;
        await answer.save();
        
        res.json({ isAccepted: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};