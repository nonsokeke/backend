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

const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');
const { isValidId, validateOpportunity } = require('../utils/validators');

router.get('/', async (req, res) => {
    try {
        const opportunities = await Opportunity.find();
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

        const opportunity = new Opportunity(req.body);
        await opportunity.save();
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

        const opportunity = await Opportunity.findById(req.params.id);
        if (!opportunity) {
            return res.status(404).json({ error: 'Opportunity not found' });
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

        const opportunity = await Opportunity.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

        const opportunity = await Opportunity.findByIdAndDelete(req.params.id);
        if (!opportunity) {
            return res.status(404).json({ error: 'Opportunity not found' });
        }
        res.json({ message: "Opportunity deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting opportunity' });
    }
});

module.exports = router;