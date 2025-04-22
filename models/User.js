const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_name: String,
    first_name: String,
    last_name: String,
    year_graduated: Number,
    major: String,
    company: String,
    title: String,
    email: String,
    linkedin_link: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);