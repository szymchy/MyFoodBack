const mongoose = require('mongoose');
const {model} = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
    },
    content: {
        type: String,
    },
    cover: {
        type: String,
    },
});

const postModel = model('Post', postSchema);

module.exports = postModel;