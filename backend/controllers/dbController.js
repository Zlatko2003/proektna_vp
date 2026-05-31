const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Tag = require('../models/Tag');
const Comment = require('../models/Comment');

const seedData = require('../utils/seedData');

exports.seedDatabase = async (req, res) => {
    try {
        await User.deleteMany();
        await Question.deleteMany();
        await Answer.deleteMany();
        await Tag.deleteMany();
        await Comment.deleteMany();
        
        const users = await User.insertMany(seedData.users);
        
        const questions = [];
        for (const q of seedData.questions) {
            const question = new Question({
                ...q,
                authorId: users[0]._id
            });
            await question.save();
            questions.push(question);
        }
        
        for (const a of seedData.answers) {
            const answer = new Answer({
                ...a,
                authorId: users[1]._id,
                questionId: questions[0]._id
            });
            await answer.save();
        }
        
        for (const tagName of seedData.tags) {
            const tag = new Tag({ name: tagName, questionCount: 1 });
            await tag.save();
        }
        
        res.json({ message: 'Database seeded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.clearDatabase = async (req, res) => {
    try {
        await User.deleteMany();
        await Question.deleteMany();
        await Answer.deleteMany();
        await Tag.deleteMany();
        await Comment.deleteMany();
        
        res.json({ message: 'Database cleared successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};