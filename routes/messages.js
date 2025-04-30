/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - recipient
 *         - content
 *       properties:
 *         recipient:
 *           type: string
 *           description: Recipient user ID
 *         content:
 *           type: string
 *           description: Message content
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       500:
 *         description: Server error
 * 
 * /api/messages/inbox:
 *   get:
 *     summary: Get user's inbox
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of received messages
 *       500:
 *         description: Server error
 * 
 * /api/messages/sent:
 *   get:
 *     summary: Get user's sent messages
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of sent messages
 *       500:
 *         description: Server error
 * 
 * /api/messages/conversation/{userId}:
 *   get:
 *     summary: Get conversation with specific user
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages between users
 *       500:
 *         description: Server error
 * 
 * /api/messages/{id}/read:
 *   put:
 *     summary: Mark message as read
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
 *         description: Message marked as read
 *       500:
 *         description: Server error
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/authMiddleware');
const messageService = require('../services/messageService');

router.use(authenticate);

router.post('/', async (req, res) => {
  try {
    const { recipient, content } = req.body;
    const message = await messageService.sendMessage(req.user.id, recipient, content);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
});

router.get('/inbox', async (req, res) => {
  try {
    const messages = await messageService.getInbox(req.user.id);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching inbox' });
  }
});

router.get('/sent', async (req, res) => {
  try {
    const messages = await messageService.getSentMessages(req.user.id);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sent messages' });
  }
});

router.get('/conversation/:userId', async (req, res) => {
  try {
    const messages = await messageService.getConversation(req.user.id, req.params.userId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching conversation' });
  }
});

router.put('/:id/read', async (req, res) => {
  try {
    const message = await messageService.markAsRead(req.params.id);
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Error marking message as read' });
  }
});

module.exports = router;
