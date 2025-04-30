/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - user_name
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *         - year_graduated
 *       properties:
 *         user_name:
 *           type: string
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         year_graduated:
 *           type: number
 *         major:
 *           type: string
 *         company:
 *           type: string
 *         title:
 *           type: string
 *         linkedin_link:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           default: user
 */

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
    linkedin_link: String,
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    refreshToken: String,
    approved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Add method to check if user is admin
userSchema.methods.isAdmin = function () {
    return this.role === 'admin';
};

module.exports = mongoose.model('User', userSchema);