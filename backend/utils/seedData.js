const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Admin User',
        email: 'admin@test.com',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin'
    },
    {
        name: 'Regular User',
        email: 'user@test.com',
        password: bcrypt.hashSync('user123', 10),
        role: 'user'
    }
];

const questions = [
    {
        title: 'How to use useState in React?',
        content: 'I am learning React and I want to understand how useState hook works. Can someone explain with examples?',
        tags: ['react', 'hooks']
    },
    {
        title: 'What is middleware in Express?',
        content: 'I see middleware being used in Express.js but I dont fully understand the concept. Can you explain?',
        tags: ['express', 'nodejs']
    }
];

const answers = [
    {
        content: 'useState is a Hook that lets you add React state to function components...',
        votes: 5
    }
];

const tags = ['react', 'angular', 'nodejs', 'express', 'mongodb', 'javascript', 'typescript'];

module.exports = { users, questions, answers, tags };