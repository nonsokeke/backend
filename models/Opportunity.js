const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
    title: String,
    posted_by: String,
    type: String,
    description: String,
    needs_approval: Boolean,
    approved: Boolean,
    approved_by: String,
    is_paid: Boolean,
    amount: String
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);