const messageService = require('../../services/messageService');
const Message = require('../../models/Message');
const mongoose = require('mongoose');

describe('MessageService', () => {
  const senderId = new mongoose.Types.ObjectId();
  const recipientId = new mongoose.Types.ObjectId();
  const mockMessage = {
    sender: senderId,
    recipient: recipientId,
    content: 'Test message'
  };

  describe('sendMessage', () => {
    it('should create a new message', async () => {
      const message = await messageService.sendMessage(
        senderId,
        recipientId,
        mockMessage.content
      );

      expect(message.content).toBe(mockMessage.content);
      expect(message.sender.toString()).toBe(senderId.toString());
      expect(message.recipient.toString()).toBe(recipientId.toString());
      expect(message.read).toBe(false);
    });
  });

  describe('markAsRead', () => {
    it('should mark message as read', async () => {
      const message = await messageService.sendMessage(
        senderId,
        recipientId,
        'Test message'
      );

      const updatedMessage = await messageService.markAsRead(message._id);
      expect(updatedMessage.read).toBe(true);
    });
  });
});