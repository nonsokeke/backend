const mongoose = require('mongoose');

const majorSchema = new mongoose.Schema({
    name: String,
    department: String
});

module.exports = mongoose.model('Major', majorSchema);