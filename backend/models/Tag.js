const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    questionCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Tag', tagSchema);