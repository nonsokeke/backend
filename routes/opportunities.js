/**
 * @swagger
 * components:
 *   schemas:
 *     Opportunity:
 *       type: object
 *       required:
 *         - title
 *         - posted_by
 *         - description
 *       properties:
 *         title:
 *           type: string
 *         posted_by:
 *           type: string
 *         type:
 *           type: string
 *         description:
 *           type: string
 *         needs_approval:
 *           type: boolean
 *         approved:
 *           type: boolean
 *         approved_by:
 *           type: string
 *         is_paid:
 *           type: boolean
 *         amount:
 *           type: string
 */

/**
 * @swagger
 * /api/opportunities:
 *   get:
 *     summary: Get all opportunities
 *     responses:
 *       200:
 *         description: List of all opportunities
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new opportunity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Opportunity'
 *     responses:
 *       201:
 *         description: Opportunity created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/opportunities/{id}:
 *   put:
 *     summary: Update an opportunity
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
 *             $ref: '#/components/schemas/Opportunity'
 *     responses:
 *       200:
 *         description: Opportunity updated successfully
 *       404:
 *         description: Opportunity not found
 *   delete:
 *     summary: Delete an opportunity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Opportunity deleted successfully
 *       404:
 *         description: Opportunity not found
 */

/**
 * @swagger
 * /api/opportunities/{id}:
 *   get:
 *     summary: Get an opportunity by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Opportunity details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Opportunity'
 *       404:
 *         description: Opportunity not found
 *       400:
 *         description: Invalid ID format
 */

/**
 * @swagger
 * /api/opportunities/unapproved:
 *   get:
 *     summary: Get all unapproved opportunities (Admin only)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of unapproved opportunities
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/opportunities/{id}/approve:
 *   put:
 *     summary: Approve an opportunity (Admin only)
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
 *         description: Opportunity approved successfully
 *       403:
 *         description: Admin access required
 */

const express = require('express');
const router = express.Router();
const { isValidId, validateOpportunity } = require('../utils/validators');
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const opportunityService = require('../services/opportunityService');

// Protect all routes
router.use(authenticate);

// Admin routes
router.get('/unapproved', authorizeAdmin, async (req, res) => {
    try {
        const opportunities = await opportunityService.getUnapprovedOpportunities();
        res.json(opportunities);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching unapproved opportunities' });
    }
});

router.put('/:id/approve', authorizeAdmin, async (req, res) => {
    try {
        const opportunity = await opportunityService.approveOpportunity(req.params.id, req.user.id);
        if (!opportunity) {
            return res.status(404).json({ error: 'Opportunity not found' });
        }
        res.json(opportunity);
    } catch (error) {
        res.status(500).json({ error: 'Error approving opportunity' });
    }
});

router.get('/', async (req, res) => {
    try {
        const opportunities = await opportunityService.getApprovedOpportunities();
        res.json(opportunities);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching opportunities' });
    }
});

router.post('/', async (req, res) => {
    try {
        const errors = validateOpportunity(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const opportunity = await opportunityService.createOpportunity(req.body);
        res.status(201).json(opportunity);
    } catch (error) {
        res.status(500).json({ error: 'Error creating opportunity' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const opportunity = await opportunityService.getOpportunityById(req.params.id);
        if (!opportunity) {
            return res.status(404).json({ error: 'Opportunity not found or not approved' });
        }
        res.json(opportunity);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching opportunity' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const errors = validateOpportunity(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const opportunity = await opportunityService.updateOpportunity(req.params.id, req.body);
        if (!opportunity) {
            return res.status(404).json({ error: 'Opportunity not found' });
        }
        res.json(opportunity);
    } catch (error) {
        res.status(500).json({ error: 'Error updating opportunity' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const opportunity = await opportunityService.deleteOpportunity(req.params.id);
        if (!opportunity) {
            return res.status(404).json({ error: 'Opportunity not found' });
        }
        res.json({ message: "Opportunity deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting opportunity' });
    }
});

module.exports = router;