/**
 * @swagger
 * components:
 *   schemas:
 *     Major:
 *       type: object
 *       required:
 *         - name
 *         - department
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the major
 *         department:
 *           type: string
 *           description: Department the major belongs to
 */

/**
 * @swagger
 * /api/majors:
 *   get:
 *     summary: Get all majors
 *     responses:
 *       200:
 *         description: List of all majors
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new major
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Major'
 *     responses:
 *       201:
 *         description: Major created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/majors/{id}:
 *   put:
 *     summary: Update a major
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
 *             $ref: '#/components/schemas/Major'
 *     responses:
 *       200:
 *         description: Major updated successfully
 *       404:
 *         description: Major not found
 *   delete:
 *     summary: Delete a major
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Major deleted successfully
 *       404:
 *         description: Major not found
 */

/**
 * @swagger
 * /api/majors/{id}:
 *   get:
 *     summary: Get a major by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Major details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Major'
 *       404:
 *         description: Major not found
 *       400:
 *         description: Invalid ID format
 */

const express = require('express');
const router = express.Router();
const Major = require('../models/Major');
const { authenticate } = require('../middlewares/authMiddleware');

router.use(authenticate);

router.get('/', async (req, res) => {
    try {
        const majors = await Major.find();
        res.json(majors);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching majors' });
    }
});

router.post('/', async (req, res) => {
    const major = new Major(req.body);
    await major.save();
    res.status(201).json(major);
});

router.put('/:id', async (req, res) => {
    const major = await Major.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(major);
});

router.delete('/:id', async (req, res) => {
    await Major.findByIdAndDelete(req.params.id);
    res.json({ message: "Major deleted" });
});

router.get('/:id', async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        const major = await Major.findById(req.params.id);
        if (!major) {
            return res.status(404).json({ error: 'Major not found' });
        }
        res.json(major);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching major' });
    }
});

module.exports = router;