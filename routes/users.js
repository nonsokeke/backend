const express = require('express');
const router = express.Router();
const { isValidId, validateUser } = require('../utils/validators');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const userService = require('../services/userService');

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
 *         - year_graduated
 *       properties:
 *         user_name:
 *           type: string
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         year_graduated:
 *           type: number
 *         major:
 *           type: string
 *         company:
 *           type: string
 *         title:
 *           type: string
 *         email:
 *           type: string
 *         linkedin_link:
 *           type: string
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all approved users
 *     responses:
 *       200:
 *         description: List of all approved users
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get an approved user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found or not approved
 *       400:
 *         description: Invalid ID format
 *   put:
 *     summary: Update a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
/**
* @swagger
* /api/users/username/{username}:
*   get:
*     summary: Get a user by username
*     parameters:
*       - in: path
*         name: username
*         required: true
*         schema:
*           type: string
*         description: Username of the user
*     responses:
*       200:
*         description: User details
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       404:
*         description: User not found
*/

/**
 * @swagger
 * /api/users/unapproved:
 *   get:
 *     summary: Get all unapproved users (Admin only)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of unapproved users
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/users/{id}/approve:
 *   put:
 *     summary: Approve a user (Admin only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User approved successfully
 *       403:
 *         description: Admin access required
 */

// Protect all routes
router.use(authenticate);

// Admin routes
router.get('/unapproved', authorizeAdmin, async (req, res) => {
    try {
        const users = await userService.getUnapprovedUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching unapproved users' });
    }
});

router.put('/:id/approve', authorizeAdmin, async (req, res) => {
    try {
        const user = await userService.approveUser(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error approving user' });
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

router.post('/', async (req, res) => {
    try {
        const errors = validateUser(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const userExists = await userService.checkUserExists(req.body.email);
        if (userExists) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found or not approved' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
});

router.get('/username/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const user = await userService.getUserByUsername(username);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const errors = validateUser(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const user = await userService.updateUser(req.params.id, req.body);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const user = await userService.deleteUser(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
});

module.exports = router;