const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 10 },
    content: { type: String, required: true, minlength: 20 },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);