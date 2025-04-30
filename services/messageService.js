const Message = require('../models/Message');

class MessageService {
  async sendMessage(senderId, recipientId, content) {
    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      content
    });
    return await message.save();
  }

  async getInbox(userId) {
    return await Message.find({ recipient: userId })
      .populate('sender', 'user_name')
      .sort({ createdAt: -1 });
  }

  async getSentMessages(userId) {
    return await Message.find({ sender: userId })
      .populate('recipient', 'user_name')
      .sort({ createdAt: -1 });
  }

  async getConversation(userId1, userId2) {
    return await Message.find({
      $or: [
        { sender: userId1, recipient: userId2 },
        { sender: userId2, recipient: userId1 }
      ]
    })
      .populate('sender', 'user_name')
      .populate('recipient', 'user_name')
      .sort({ createdAt: -1 });
  }

  async markAsRead(messageId) {
    return await Message.findByIdAndUpdate(
      messageId,
      { read: true },
      { new: true }
    );
  }
}

module.exports = new MessageService();
